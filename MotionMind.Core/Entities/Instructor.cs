namespace MotionMind.Core.Entities;

public class Instructor
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Specialty { get; set; } = string.Empty; // e.g. "Pilates", "PE", "Yoga"

    // Navigation
    public ICollection<LessonPlan> LessonPlans { get; set; } = new List<LessonPlan>();
}
