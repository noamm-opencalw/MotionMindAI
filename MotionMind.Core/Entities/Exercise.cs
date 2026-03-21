namespace MotionMind.Core.Entities;

public class Exercise
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int DurationSeconds { get; set; }
    public string Category { get; set; } = string.Empty; // e.g. "Warm-Up", "Core", "Cool-Down"
    public string CoachCues { get; set; } = string.Empty; // Coaching tips / verbal cues

    // FK (optional — exercises can exist standalone or within a plan)
    public int? LessonPlanId { get; set; }
    public LessonPlan? LessonPlan { get; set; }
}
