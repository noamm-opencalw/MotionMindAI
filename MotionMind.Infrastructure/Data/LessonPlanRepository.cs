using Microsoft.EntityFrameworkCore;
using MotionMind.Core.Entities;
using MotionMind.Core.Interfaces;

namespace MotionMind.Infrastructure.Data;

public class LessonPlanRepository : ILessonPlanRepository
{
    private readonly ApplicationDbContext _context;

    public LessonPlanRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<LessonPlan?> GetByIdAsync(int id)
    {
        return await _context.LessonPlans
            .Include(lp => lp.Instructor)
            .Include(lp => lp.Exercises)
            .FirstOrDefaultAsync(lp => lp.Id == id);
    }

    public async Task<IEnumerable<LessonPlan>> GetAllAsync()
    {
        return await _context.LessonPlans
            .Include(lp => lp.Instructor)
            .Include(lp => lp.Exercises)
            .ToListAsync();
    }

    public async Task<LessonPlan> AddAsync(LessonPlan lessonPlan)
    {
        _context.LessonPlans.Add(lessonPlan);
        await _context.SaveChangesAsync();
        return lessonPlan;
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}