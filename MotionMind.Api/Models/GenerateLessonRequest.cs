namespace MotionMind.Api.Models;

/// <summary>Request DTO for lesson generation.</summary>
public record GenerateLessonRequest(
    string TargetAge,
    string FocusArea,
    int DurationMinutes
);