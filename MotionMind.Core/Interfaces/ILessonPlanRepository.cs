using MotionMind.Core.Entities;

namespace MotionMind.Core.Interfaces;

public interface ILessonPlanRepository
{
    Task<LessonPlan?> GetByIdAsync(int id);
    Task<IEnumerable<LessonPlan>> GetAllAsync();
    Task<LessonPlan> AddAsync(LessonPlan lessonPlan);
    Task SaveChangesAsync();
}
