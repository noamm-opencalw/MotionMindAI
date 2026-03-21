using MotionMind.Core.Entities;

namespace MotionMind.Core.Interfaces;

/// <summary>
/// Contract for generating AI-powered lesson plans.
/// Implementations can swap between mock, RAG, or LLM backends.
/// </summary>
public interface IAIGenerationService
{
    /// <summary>
    /// Generates a structured LessonPlan for the given parameters.
    /// </summary>
    /// <param name="targetAge">Target age group, e.g. "6-8", "Teens", "Adults"</param>
    /// <param name="focusArea">Movement focus, e.g. "Core Strength", "Balance", "Flexibility"</param>
    /// <param name="durationMinutes">Total lesson duration in minutes</param>
    /// <returns>A fully populated LessonPlan with exercises</returns>
    Task<LessonPlan> GenerateLessonAsync(string targetAge, string focusArea, int durationMinutes);
}
