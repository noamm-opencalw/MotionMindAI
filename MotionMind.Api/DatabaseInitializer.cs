using MotionMind.Core.Entities;
using MotionMind.Infrastructure.Data;

namespace MotionMind.Api;

public static class DatabaseInitializer
{
    public static async Task InitializeAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        // Ensure database is created
        await context.Database.EnsureCreatedAsync();

        // Seed default instructor if none exists
        if (!context.Instructors.Any())
        {
            var defaultInstructor = new Instructor
            {
                Name = "AI Fitness Coach",
                Specialty = "AI-Generated Workouts"
            };

            context.Instructors.Add(defaultInstructor);
            await context.SaveChangesAsync();
        }
    }
}