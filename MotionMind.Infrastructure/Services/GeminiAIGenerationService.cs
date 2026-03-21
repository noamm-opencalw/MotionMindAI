using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MotionMind.Core.Entities;
using MotionMind.Core.Interfaces;

namespace MotionMind.Infrastructure.Services;

/// <summary>
/// Real AI implementation using Google Gemini Flash (free tier).
/// Get API key: https://aistudio.google.com/app/apikey
/// Set in appsettings.json: "Gemini": { "ApiKey": "YOUR_KEY" }
/// </summary>
public class GeminiAIGenerationService : IAIGenerationService
{
    private readonly HttpClient _http;
    private readonly string _apiKey;
    private readonly ILogger<GeminiAIGenerationService> _logger;

    private const string Model = "gemini-2.5-flash";
    private const string BaseUrl = "https://generativelanguage.googleapis.com/v1beta/models";

    public GeminiAIGenerationService(
        HttpClient http,
        IConfiguration config,
        ILogger<GeminiAIGenerationService> logger)
    {
        _http = http;
        _apiKey = config["Gemini:ApiKey"] ?? throw new InvalidOperationException("Gemini:ApiKey not configured");
        _logger = logger;
    }

    public async Task<LessonPlan> GenerateLessonAsync(
        string targetAge, string focusArea, int durationMinutes)
    {
        var prompt = BuildPrompt(targetAge, focusArea, durationMinutes);

        var requestBody = new
        {
            contents = new[]
            {
                new
                {
                    parts = new[] { new { text = prompt } }
                }
            },
            generationConfig = new
            {
                temperature = 0.7,
                responseMimeType = "application/json"
            }
        };

        var url = $"{BaseUrl}/{Model}:generateContent?key={_apiKey}";

        _logger.LogInformation("Calling Gemini {Model} for age={Age} focus={Focus}", Model, targetAge, focusArea);

        var response = await _http.PostAsJsonAsync(url, requestBody);
        response.EnsureSuccessStatusCode();

        var raw = await response.Content.ReadAsStringAsync();
        var geminiResponse = JsonSerializer.Deserialize<GeminiResponse>(raw, JsonOptions);

        var jsonText = geminiResponse?.Candidates?.FirstOrDefault()
            ?.Content?.Parts?.FirstOrDefault()?.Text
            ?? throw new InvalidOperationException("Empty response from Gemini");

        var plan = JsonSerializer.Deserialize<LessonPlanDto>(jsonText, JsonOptions)
            ?? throw new InvalidOperationException("Failed to parse lesson plan JSON");

        return MapToDomain(plan, targetAge, focusArea, durationMinutes);
    }

    // ── Prompt ────────────────────────────────────────────────────────────────

    private static string BuildPrompt(string targetAge, string focusArea, int durationMinutes)
    {
        var schema = """
            {
              "title": "string",
              "exercises": [
                {
                  "name": "string",
                  "description": "string",
                  "durationSeconds": number,
                  "category": "Warm-Up | Core | Strength | Flexibility | Cool-Down",
                  "coachCues": "string"
                }
              ]
            }
            """;

        return $"""
            You are a certified Pilates and Physical Education instructor.
            Generate a structured lesson plan in valid JSON.

            Parameters:
            - Target age group: {targetAge}
            - Focus area: {focusArea}
            - Total duration: {durationMinutes} minutes

            Return ONLY valid JSON matching this exact schema (no markdown, no extra text):
            {schema}

            Rules:
            - Include 4-7 exercises appropriate for {targetAge}
            - Total exercise time should fill approximately {durationMinutes} minutes
            - coachCues should be concise verbal instructions an instructor would say
            - Categories must come from the enum above
            """;
    }

    // ── Mapping ───────────────────────────────────────────────────────────────

    private static LessonPlan MapToDomain(
        LessonPlanDto dto, string targetAge, string focusArea, int durationMinutes) =>
        new()
        {
            Title = dto.Title,
            TargetAgeGroup = targetAge,
            FocusArea = focusArea,
            DurationMinutes = durationMinutes,
            InstructorId = 1,
            Exercises = dto.Exercises.Select(e => new Exercise
            {
                Name = e.Name,
                Description = e.Description,
                DurationSeconds = e.DurationSeconds,
                Category = e.Category,
                CoachCues = e.CoachCues
            }).ToList()
        };

    // ── JSON Options ──────────────────────────────────────────────────────────

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        PropertyNameCaseInsensitive = true
    };

    // ── DTOs (Gemini response shape) ──────────────────────────────────────────

    private record GeminiResponse(
        [property: JsonPropertyName("candidates")] List<Candidate>? Candidates);

    private record Candidate(
        [property: JsonPropertyName("content")] Content? Content);

    private record Content(
        [property: JsonPropertyName("parts")] List<Part>? Parts);

    private record Part(
        [property: JsonPropertyName("text")] string? Text);

    private record LessonPlanDto(
        [property: JsonPropertyName("title")] string Title,
        [property: JsonPropertyName("exercises")] List<ExerciseDto> Exercises);

    private record ExerciseDto(
        [property: JsonPropertyName("name")] string Name,
        [property: JsonPropertyName("description")] string Description,
        [property: JsonPropertyName("durationSeconds")] int DurationSeconds,
        [property: JsonPropertyName("category")] string Category,
        [property: JsonPropertyName("coachCues")] string CoachCues);
}
