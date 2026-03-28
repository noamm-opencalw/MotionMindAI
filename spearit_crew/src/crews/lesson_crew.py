from crewai import Crew, Process

from src.config.settings import get_llm
from src.agents.definitions import create_agents
from src.tasks.lesson_tasks import create_lesson_tasks, create_regenerate_tasks
from src.models.lesson import LessonOutput, RegenerateExerciseOutput


def run_lesson_crew(inputs: dict, api_key: str | None = None) -> LessonOutput:
    """Run the full 6-agent lesson generation crew."""
    llm = get_llm(api_key=api_key)
    agents = create_agents(llm)
    tasks = create_lesson_tasks(agents, inputs)

    crew = Crew(
        agents=list(agents.values()),
        tasks=tasks,
        process=Process.sequential,
        verbose=True,
    )

    result = crew.kickoff()
    return result.pydantic


def run_regenerate_crew(inputs: dict, api_key: str | None = None) -> RegenerateExerciseOutput:
    """Run a lightweight crew for single exercise regeneration."""
    llm = get_llm(api_key=api_key)
    agents = create_agents(llm)
    tasks = create_regenerate_tasks(agents, inputs)

    crew = Crew(
        agents=[agents["exercise_designer"], agents["head_coach"]],
        tasks=tasks,
        process=Process.sequential,
        verbose=True,
    )

    result = crew.kickoff()
    return result.pydantic
