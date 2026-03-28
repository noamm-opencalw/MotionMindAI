from crewai import Crew, Process

from src.config.settings import get_llm
from src.agents.definitions import create_agents
from src.tasks.program_tasks import create_program_tasks
from src.models.program import ProgramOutput


def run_program_crew(inputs: dict, api_key: str | None = None) -> ProgramOutput:
    """Run the full 6-agent program generation crew."""
    llm = get_llm(api_key=api_key)
    agents = create_agents(llm)
    tasks = create_program_tasks(agents, inputs)

    crew = Crew(
        agents=list(agents.values()),
        tasks=tasks,
        process=Process.sequential,
        verbose=True,
    )

    result = crew.kickoff()
    return result.pydantic
