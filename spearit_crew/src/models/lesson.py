from pydantic import BaseModel, Field
from typing import Literal


class Exercise(BaseModel):
    name: str = Field(description="Exercise name in Hebrew")
    description: str = Field(description="Exercise description and instructions in Hebrew")
    durationSeconds: int = Field(description="Duration in seconds")
    category: Literal["Warm-Up", "Core", "Strength", "Flexibility", "Cool-Down"]
    coachCues: str = Field(description="Professional coaching cues in Hebrew")
    equipment: str = Field(description="Required equipment in Hebrew, or 'ללא' if none")


class MusicRecommendation(BaseModel):
    title: str = Field(description="Song title")
    artist: str = Field(description="Artist name")
    tempo: Literal["slow", "medium", "fast"]


class LessonOutput(BaseModel):
    title: str = Field(description="Lesson title in Hebrew")
    exercises: list[Exercise] = Field(description="Ordered list of exercises")
    musicRecommendations: list[MusicRecommendation] = Field(
        description="3-5 music recommendations matching workout tempo"
    )
    nutritionTips: list[str] = Field(
        default_factory=list,
        description="Pre/post workout nutrition tips in Hebrew",
    )
    safetyNotes: list[str] = Field(
        default_factory=list,
        description="Safety notes and contraindications in Hebrew",
    )


class RegenerateExerciseOutput(BaseModel):
    exercise: Exercise
