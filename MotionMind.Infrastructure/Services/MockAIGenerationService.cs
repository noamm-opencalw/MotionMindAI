using MotionMind.Core.Entities;
using MotionMind.Core.Interfaces;

namespace MotionMind.Infrastructure.Services;

/// <summary>
/// Mock implementation of IAIGenerationService.
/// Returns a deterministic structured LessonPlan for dev/testing.
///
/// --- RAG / LLM INTEGRATION POINT ---
/// Replace this class (or add a new implementation) to connect to a real AI backend:
///
/// Option A — OpenAI / Azure OpenAI:
///   1. Add NuGet: Azure.AI.OpenAI or OpenAI
///   2. Build a system prompt describing the lesson format (JSON schema).
///   3. Inject IChatClient / OpenAIClient via DI.
///   4. Call chat.GetResponseAsync(prompt) and deserialize the JSON response.
///
/// Option B — RAG (Retrieval-Augmented Generation):
///   1. Store exercise embeddings in pgvector (PostgreSQL extension).
///   2. On each request, embed (targetAge + focusArea) → vector query top-K exercises.
///   3. Pass retrieved exercises as context into the LLM prompt.
///   4. LLM selects and sequences exercises into a structured plan.
///
/// Option C — Local LLM (Ollama / LM Studio):
///   1. Use HttpClient to call http://localhost:11434/api/generate (Ollama REST API).
///   2. Parse the streamed JSON response into LessonPlan.
/// </summary>
public class MockAIGenerationService : IAIGenerationService
{
    public Task<LessonPlan> GenerateLessonAsync(
        string targetAge, string focusArea, int durationMinutes)
    {
        // --- MOCK STRUCTURED OUTPUT ---
        // In production this would be the deserialized LLM response.
        var plan = new LessonPlan
        {
            Title = $"{focusArea} Session for {targetAge}",
            TargetAgeGroup = targetAge,
            FocusArea = focusArea,
            DurationMinutes = durationMinutes,
            InstructorId = 1, // default seeded instructor
            Exercises = new List<Exercise>
            {
                new()
                {
                    Name = "Cat-Cow Stretch",
                    Description = "On all fours, alternate arching and rounding the spine.",
                    DurationSeconds = 60,
                    Category = "Warm-Up",
                    CoachCues = "Breathe in as you arch (cow), breathe out as you round (cat). Keep movements slow and controlled."
                },
                new()
                {
                    Name = "Pilates Hundred",
                    Description = "Lie on back, legs at tabletop, pump arms 100 times while holding core tension.",
                    DurationSeconds = 120,
                    Category = "Core",
                    CoachCues = "Chin to chest, lower back imprinted. Inhale for 5 pumps, exhale for 5. Shoulders down."
                },
                new()
                {
                    Name = "Single Leg Stretch",
                    Description = "Alternate pulling knees to chest while keeping the opposite leg extended.",
                    DurationSeconds = 90,
                    Category = "Core",
                    CoachCues = "Hand on ankle, hand on knee. Switch legs with control. Keep abs scooped."
                },
                new()
                {
                    Name = "Child's Pose",
                    Description = "Kneel and stretch arms forward, resting forehead on mat.",
                    DurationSeconds = 45,
                    Category = "Cool-Down",
                    CoachCues = "Breathe deeply into the lower back. Relax shoulders away from ears."
                }
            }
        };

        return Task.FromResult(plan);
    }
}
