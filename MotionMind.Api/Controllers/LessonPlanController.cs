using Microsoft.AspNetCore.Mvc;
using MotionMind.Core.Interfaces;

namespace MotionMind.Api.Controllers;

[ApiController]
[Route("api/lessons")]
public class LessonPlanController : ControllerBase
{
    private readonly IAIGenerationService _aiService;
    private readonly ILogger<LessonPlanController> _logger;

    public LessonPlanController(
        IAIGenerationService aiService,
        ILogger<LessonPlanController> logger)
    {
        _aiService = aiService;
        _logger = logger;
    }

    /// <summary>
    /// Generate a lesson plan using AI.
    /// POST /api/lessons/generate
    /// </summary>
    [HttpPost("generate")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GenerateLesson([FromBody] GenerateLessonRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        _logger.LogInformation(
            "Generating lesson: age={Age}, focus={Focus}, duration={Duration}min",
            request.TargetAge, request.FocusArea, request.DurationMinutes);

        var lesson = await _aiService.GenerateLessonAsync(
            request.TargetAge,
            request.FocusArea,
            request.DurationMinutes);

        return Ok(lesson);
    }
}

/// <summary>Request DTO for lesson generation.</summary>
public record GenerateLessonRequest(
    string TargetAge,
    string FocusArea,
    int DurationMinutes
);
