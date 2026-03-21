namespace MotionMind.Core.Entities;

public class LessonPlan
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string TargetAgeGroup { get; set; } = string.Empty; // e.g. "6-8", "Adults"
    public string FocusArea { get; set; } = string.Empty;      // e.g. "Core Strength", "Flexibility"
    public int DurationMinutes { get; set; }

    // FK
    public int InstructorId { get; set; }
    public Instructor Instructor { get; set; } = null!;

    // Navigation
    public ICollection<Exercise> Exercises { get; set; } = new List<Exercise>();
}
