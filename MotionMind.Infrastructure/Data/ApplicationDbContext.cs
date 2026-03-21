using Microsoft.EntityFrameworkCore;
using MotionMind.Core.Entities;

namespace MotionMind.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    public DbSet<Instructor> Instructors => Set<Instructor>();
    public DbSet<LessonPlan> LessonPlans => Set<LessonPlan>();
    public DbSet<Exercise> Exercises => Set<Exercise>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Instructor
        modelBuilder.Entity<Instructor>(e =>
        {
            e.HasKey(i => i.Id);
            e.Property(i => i.Name).HasMaxLength(200).IsRequired();
            e.Property(i => i.Specialty).HasMaxLength(100);
        });

        // LessonPlan
        modelBuilder.Entity<LessonPlan>(e =>
        {
            e.HasKey(lp => lp.Id);
            e.Property(lp => lp.Title).HasMaxLength(300).IsRequired();
            e.Property(lp => lp.TargetAgeGroup).HasMaxLength(50);
            e.Property(lp => lp.FocusArea).HasMaxLength(100);

            e.HasOne(lp => lp.Instructor)
             .WithMany(i => i.LessonPlans)
             .HasForeignKey(lp => lp.InstructorId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // Exercise
        modelBuilder.Entity<Exercise>(e =>
        {
            e.HasKey(ex => ex.Id);
            e.Property(ex => ex.Name).HasMaxLength(200).IsRequired();
            e.Property(ex => ex.Category).HasMaxLength(100);
            e.Property(ex => ex.CoachCues).HasMaxLength(1000);

            e.HasOne(ex => ex.LessonPlan)
             .WithMany(lp => lp.Exercises)
             .HasForeignKey(ex => ex.LessonPlanId)
             .OnDelete(DeleteBehavior.SetNull)
             .IsRequired(false);
        });
    }
}
