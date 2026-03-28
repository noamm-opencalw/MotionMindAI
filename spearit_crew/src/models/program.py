from pydantic import BaseModel, Field


class ProgramExercise(BaseModel):
    name: str = Field(description="Exercise name in Hebrew")
    sets: int = Field(description="Number of sets")
    reps: str = Field(description="Reps or duration, e.g. '12' or '30 שניות'")
    rest: str = Field(description="Rest between sets in Hebrew, e.g. '60 שניות'")
    notes: str = Field(description="Exercise notes/cues in Hebrew")


class TrainingDay(BaseModel):
    dayNumber: int = Field(description="Day of week: 1=Sunday through 7=Saturday")
    type: str = Field(description="training, rest, or active-recovery")
    title: str = Field(description="Day title in Hebrew")
    focus: str = Field(description="Muscle group or training focus in Hebrew")
    duration: int = Field(description="Session duration in minutes")
    exercises: list[ProgramExercise] = Field(default_factory=list)


class TrainingWeek(BaseModel):
    weekNumber: int
    theme: str = Field(description="Week theme in Hebrew")
    days: list[TrainingDay]


class Phase(BaseModel):
    name: str = Field(description="Phase name in Hebrew")
    weekStart: int
    weekEnd: int
    focus: str = Field(description="Phase focus in Hebrew")
    intensity: str = Field(description="low, moderate, high, or very-high")


class NutritionPlan(BaseModel):
    calories: str = Field(description="Daily calorie recommendation in Hebrew")
    protein: str = Field(description="Protein recommendation in Hebrew")
    tips: list[str] = Field(description="Nutrition tips in Hebrew")


class ProgramOutput(BaseModel):
    title: str = Field(description="Program title in Hebrew")
    description: str = Field(description="Program overview in Hebrew")
    totalWeeks: int
    daysPerWeek: int
    phases: list[Phase]
    weeks: list[TrainingWeek]
    nutrition: NutritionPlan
    tips: list[str] = Field(description="General training tips in Hebrew")
    safetyNotes: list[str] = Field(
        default_factory=list,
        description="Safety notes in Hebrew",
    )
