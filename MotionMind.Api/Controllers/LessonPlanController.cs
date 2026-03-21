using Microsoft.AspNetCore.Mvc;
using MotionMind.Api.Models;
using MotionMind.Core.Interfaces;

namespace MotionMind.Api.Controllers;

[ApiController]
[Route("api/lessons")]
public class LessonPlanController : ControllerBase
{
    private readonly IAIGenerationService _aiService;
    private readonly ILessonPlanRepository _repository;
    private readonly ILogger<LessonPlanController> _logger;

    public LessonPlanController(
        IAIGenerationService aiService,
        ILessonPlanRepository repository,
        ILogger<LessonPlanController> logger)
    {
        _aiService = aiService;
        _repository = repository;
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

        // Save to database
        await _repository.AddAsync(lesson);

        return Ok(lesson);
    }

    /// <summary>
    /// Get all lesson plans.
    /// GET /api/lessons
    /// </summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllLessons()
    {
        var lessons = await _repository.GetAllAsync();
        return Ok(lessons);
    }

    /// <summary>
    /// Get a lesson plan by ID.
    /// GET /api/lessons/{id}
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetLesson(int id)
    {
        var lesson = await _repository.GetByIdAsync(id);
        if (lesson == null)
            return NotFound();

        return Ok(lesson);
    }
}
