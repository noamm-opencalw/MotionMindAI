from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from src.crews.lesson_crew import run_lesson_crew, run_regenerate_crew
from src.crews.program_crew import run_program_crew

router = APIRouter(prefix="/api")


# =============================
# Request Models
# =============================
class LessonRequest(BaseModel):
    targetAge: str = "מבוגרים"
    gender: str = "mixed"
    focusAreas: list[str] = ["Core Strength"]
    durationMinutes: int = 45
    equipment: list[str] = ["ללא ציוד"]
    apiKey: str | None = None


class ProgramRequest(BaseModel):
    goal: str = "general-fitness"
    goalCustom: str = ""
    gender: str = "male"
    age: str = ""
    weight: str = ""
    fitnessLevel: str = "beginner"
    location: str = "home"
    equipment: list[str] = []
    daysPerWeek: int = 3
    sessionDuration: int = 45
    timeframe: str = "3-months"
    limitations: str = ""
    apiKey: str | None = None


class RegenerateRequest(BaseModel):
    exerciseContext: str
    userNote: str
    lessonContext: str
    apiKey: str | None = None


class TestConnectionRequest(BaseModel):
    apiKey: str


# =============================
# Endpoints
# =============================
@router.get("/health")
async def health():
    return {"status": "ok", "service": "spearit-crew"}


@router.post("/test-connection")
async def test_connection(req: TestConnectionRequest):
    """Test if the Gemini API key is valid."""
    try:
        from src.config.settings import get_llm
        llm = get_llm(api_key=req.apiKey)
        response = llm.call(messages=[{"role": "user", "content": "Say 'ok' in one word."}])
        return {"success": True, "message": "Connection successful"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Connection failed: {str(e)}")


@router.post("/generate/lesson")
async def generate_lesson(req: LessonRequest):
    """Generate a single lesson using the 6-agent crew."""
    try:
        inputs = req.model_dump(exclude={"apiKey"})
        result = run_lesson_crew(inputs, api_key=req.apiKey)
        return result.model_dump()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lesson generation failed: {str(e)}")


@router.post("/generate/program")
async def generate_program(req: ProgramRequest):
    """Generate a multi-week training program using the 6-agent crew."""
    try:
        inputs = req.model_dump(exclude={"apiKey"})
        result = run_program_crew(inputs, api_key=req.apiKey)
        return result.model_dump()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Program generation failed: {str(e)}")


@router.post("/generate/regenerate")
async def regenerate_exercise(req: RegenerateRequest):
    """Regenerate a single exercise using a lightweight crew."""
    try:
        inputs = req.model_dump(exclude={"apiKey"})
        result = run_regenerate_crew(inputs, api_key=req.apiKey)
        return result.model_dump()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Exercise regeneration failed: {str(e)}")
