from crewai import Agent, Task

from src.models.lesson import LessonOutput, RegenerateExerciseOutput


def create_lesson_tasks(agents: dict[str, Agent], inputs: dict) -> list[Task]:
    """Create the sequential tasks for lesson generation."""

    target_age = inputs.get("targetAge", "מבוגרים")
    gender = inputs.get("gender", "mixed")
    focus_areas = inputs.get("focusAreas", ["Core Strength"])
    duration = inputs.get("durationMinutes", 45)
    equipment = inputs.get("equipment", ["ללא ציוד"])

    focus_str = ", ".join(focus_areas)
    equipment_str = ", ".join(equipment)

    research_task = Task(
        description=(
            f"Research the latest fitness trends and exercise techniques for a "
            f"{duration}-minute workout focused on: {focus_str}.\n\n"
            f"Target audience: age group '{target_age}', gender '{gender}'.\n"
            f"Available equipment: {equipment_str}.\n\n"
            f"SEARCH for:\n"
            f"1. Latest trending exercises for {focus_str} (2024-2026)\n"
            f"2. Current fitness methodologies popular in Pilates and physical education\n"
            f"3. Evidence-based techniques specifically effective for age group '{target_age}'\n"
            f"4. Creative exercise variations that use {equipment_str}\n"
            f"5. Any new research on optimal exercise sequencing\n\n"
            f"Compile a research brief with at least 5 specific exercise ideas "
            f"or techniques that would make this workout stand out."
        ),
        expected_output=(
            "A research brief containing:\n"
            "- 5+ trending exercises with descriptions\n"
            "- Current methodology trends relevant to this workout\n"
            "- Evidence-based recommendations for the target demographic\n"
            "- Creative ideas that give an 'x factor' to the workout"
        ),
        agent=agents["fitness_researcher"],
    )

    assessment_task = Task(
        description=(
            f"Analyze the client profile and create a training assessment:\n\n"
            f"- Age group: {target_age}\n"
            f"- Gender: {gender}\n"
            f"- Focus areas: {focus_str}\n"
            f"- Duration: {duration} minutes\n"
            f"- Equipment: {equipment_str}\n\n"
            f"Based on the researcher's findings and your expertise:\n"
            f"1. Assess capabilities and limitations for age group '{target_age}'\n"
            f"2. Map available equipment to exercise options\n"
            f"3. Calculate optimal exercise distribution for {duration} minutes:\n"
            f"   - Warm-Up: ~15% of duration\n"
            f"   - Main section (Core/Strength/Flexibility based on focus): ~65%\n"
            f"   - Cool-Down: ~20% of duration\n"
            f"4. List any contraindications for this demographic\n"
            f"5. Recommend which trending exercises from the research are appropriate"
        ),
        expected_output=(
            "Client assessment with:\n"
            "- Demographic capabilities and limitations\n"
            "- Exercise time distribution plan\n"
            "- Equipment-exercise mapping\n"
            "- Approved trending exercises from research\n"
            "- Contraindications list"
        ),
        agent=agents["client_assessor"],
        context=[research_task],
    )

    design_task = Task(
        description=(
            f"Design a complete {duration}-minute workout plan.\n\n"
            f"Using the research findings and client assessment, create a structured "
            f"exercise sequence with 4-8 exercises.\n\n"
            f"REQUIREMENTS:\n"
            f"1. Include exercises from categories: Warm-Up, then main section "
            f"(Core/Strength/Flexibility based on {focus_str}), then Cool-Down\n"
            f"2. Incorporate at least 1-2 trending exercises from the research\n"
            f"3. Total duration of all exercises must equal approximately {duration} minutes\n"
            f"4. Each exercise needs: name (Hebrew), description (Hebrew), "
            f"durationSeconds, category, coachCues (Hebrew), equipment (Hebrew)\n"
            f"5. Coach cues should be detailed and professional — a trainer should "
            f"be able to read them aloud to a class\n"
            f"6. Smooth transitions between exercises\n"
            f"7. Progressive difficulty within each section\n\n"
            f"Available equipment: {equipment_str}\n"
            f"ALL TEXT IN HEBREW."
        ),
        expected_output=(
            "A complete exercise list with 4-8 exercises, each containing:\n"
            "- name (Hebrew)\n"
            "- description (Hebrew)\n"
            "- durationSeconds (integer)\n"
            "- category (Warm-Up/Core/Strength/Flexibility/Cool-Down)\n"
            "- coachCues (detailed Hebrew instructions)\n"
            "- equipment (Hebrew)"
        ),
        agent=agents["exercise_designer"],
        context=[research_task, assessment_task],
    )

    nutrition_task = Task(
        description=(
            f"Provide nutrition and recovery tips for this {duration}-minute "
            f"{focus_str} workout.\n\n"
            f"Client profile: age group '{target_age}', gender '{gender}'.\n\n"
            f"PROVIDE:\n"
            f"1. 2-3 pre-workout nutrition tips\n"
            f"2. 2-3 post-workout recovery and nutrition tips\n"
            f"3. Hydration recommendations during the workout\n"
            f"Keep tips practical, concise, and culturally relevant.\n"
            f"ALL TIPS IN HEBREW."
        ),
        expected_output=(
            "4-6 practical nutrition and recovery tips in Hebrew, "
            "appropriate for the workout intensity and client demographic."
        ),
        agent=agents["nutrition_advisor"],
        context=[design_task],
    )

    safety_task = Task(
        description=(
            f"Review the complete workout plan for safety.\n\n"
            f"Target population: {target_age}, {gender}.\n"
            f"Equipment: {equipment_str}.\n\n"
            f"CHECK:\n"
            f"1. Every exercise is appropriate for age group '{target_age}'\n"
            f"2. Warm-up adequately prepares for the main exercises\n"
            f"3. No dangerous exercise order (e.g., explosive after static stretch)\n"
            f"4. Cool-down properly returns body to baseline\n"
            f"5. Equipment usage is safe for the demographic\n"
            f"6. No overtraining risk within the {duration}-minute timeframe\n\n"
            f"If any exercise is unsafe, suggest a specific safer alternative.\n"
            f"Provide 2-3 safety notes for the trainer.\n"
            f"ALL NOTES IN HEBREW."
        ),
        expected_output=(
            "Safety review with:\n"
            "- APPROVED or specific modifications needed\n"
            "- 2-3 safety notes in Hebrew for the trainer\n"
            "- Any exercise substitutions if needed"
        ),
        agent=agents["safety_reviewer"],
        context=[design_task, assessment_task],
    )

    final_task = Task(
        description=(
            f"Assemble the final workout plan as structured JSON.\n\n"
            f"Combine all previous work into the final output:\n"
            f"1. Polish all Hebrew coaching cues — make them professional and motivating\n"
            f"2. Apply any safety modifications from the Safety Reviewer\n"
            f"3. Incorporate the nutrition tips\n"
            f"4. Add 3-5 music recommendations:\n"
            f"   - Mix of Israeli/Hebrew songs and international hits\n"
            f"   - Match tempo to exercise section (slow for warm-up/cool-down, "
            f"fast for main section)\n"
            f"   - Each with: title, artist, tempo (slow/medium/fast)\n"
            f"5. Create a compelling Hebrew title for the workout\n"
            f"6. Add your 'x factor' — a unique coaching touch, motivational element, "
            f"or creative twist\n\n"
            f"The output MUST match the exact JSON schema expected by the frontend."
        ),
        expected_output="The complete lesson plan as structured JSON matching LessonOutput schema.",
        agent=agents["head_coach"],
        context=[design_task, nutrition_task, safety_task],
        output_pydantic=LessonOutput,
    )

    return [research_task, assessment_task, design_task, nutrition_task, safety_task, final_task]


def create_regenerate_tasks(agents: dict[str, Agent], inputs: dict) -> list[Task]:
    """Create tasks for regenerating a single exercise."""

    exercise_context = inputs.get("exerciseContext", "")
    user_note = inputs.get("userNote", "")
    lesson_context = inputs.get("lessonContext", "")

    design_task = Task(
        description=(
            f"Redesign a single exercise based on user feedback.\n\n"
            f"CURRENT EXERCISE:\n{exercise_context}\n\n"
            f"USER REQUEST: {user_note}\n\n"
            f"LESSON CONTEXT:\n{lesson_context}\n\n"
            f"Create a replacement exercise that:\n"
            f"1. Addresses the user's request\n"
            f"2. Fits the same category and approximate duration\n"
            f"3. Works with the available equipment\n"
            f"4. Has professional Hebrew coaching cues\n"
            f"ALL TEXT IN HEBREW."
        ),
        expected_output="A single exercise with name, description, durationSeconds, category, coachCues, equipment — all in Hebrew.",
        agent=agents["exercise_designer"],
    )

    final_task = Task(
        description=(
            "Polish the redesigned exercise:\n"
            "1. Ensure coaching cues are professional and detailed\n"
            "2. Verify the exercise fits smoothly into the lesson flow\n"
            "3. Output as structured JSON matching the Exercise schema."
        ),
        expected_output="The final exercise as structured JSON matching RegenerateExerciseOutput schema.",
        agent=agents["head_coach"],
        context=[design_task],
        output_pydantic=RegenerateExerciseOutput,
    )

    return [design_task, final_task]
