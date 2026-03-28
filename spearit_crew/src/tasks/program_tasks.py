from crewai import Agent, Task

from src.models.program import ProgramOutput


def create_program_tasks(agents: dict[str, Agent], inputs: dict) -> list[Task]:
    """Create the sequential tasks for training program generation."""

    goal = inputs.get("goal", "general-fitness")
    goal_custom = inputs.get("goalCustom", "")
    gender = inputs.get("gender", "male")
    age = inputs.get("age", "")
    weight = inputs.get("weight", "")
    fitness_level = inputs.get("fitnessLevel", "beginner")
    location = inputs.get("location", "home")
    equipment = inputs.get("equipment", [])
    days_per_week = inputs.get("daysPerWeek", 3)
    session_duration = inputs.get("sessionDuration", 45)
    timeframe = inputs.get("timeframe", "3-months")
    limitations = inputs.get("limitations", "")

    equipment_str = ", ".join(equipment) if equipment else "ללא ציוד"
    goal_desc = f"{goal}"
    if goal_custom:
        goal_desc += f" — {goal_custom}"

    research_task = Task(
        description=(
            f"Research the latest training science for a {timeframe} program.\n\n"
            f"Goal: {goal_desc}\n"
            f"Fitness level: {fitness_level}\n"
            f"Training location: {location}\n\n"
            f"SEARCH for:\n"
            f"1. Latest periodization approaches for '{goal}' goals (2024-2026)\n"
            f"2. Evidence-based training splits for {days_per_week}x/week programs\n"
            f"3. Progressive overload strategies for {fitness_level} level\n"
            f"4. Current trends in {location}-based training\n"
            f"5. Latest nutrition science for {goal} goals\n"
            f"6. Recovery and deload protocols for {timeframe} programs\n\n"
            f"Compile a comprehensive research brief."
        ),
        expected_output=(
            "Research brief with:\n"
            "- Periodization recommendations\n"
            "- Optimal training split for the schedule\n"
            "- Progressive overload strategy\n"
            "- Current methodology trends\n"
            "- Nutrition science highlights"
        ),
        agent=agents["fitness_researcher"],
    )

    assessment_task = Task(
        description=(
            f"Create a comprehensive client assessment for program design.\n\n"
            f"CLIENT PROFILE:\n"
            f"- Goal: {goal_desc}\n"
            f"- Gender: {gender}\n"
            f"- Age: {age or 'not specified'}\n"
            f"- Weight: {weight or 'not specified'} kg\n"
            f"- Fitness level: {fitness_level}\n"
            f"- Location: {location}\n"
            f"- Equipment: {equipment_str}\n"
            f"- Days/week: {days_per_week}\n"
            f"- Session duration: {session_duration} minutes\n"
            f"- Timeframe: {timeframe}\n"
            f"- Limitations: {limitations or 'none'}\n\n"
            f"ASSESS:\n"
            f"1. Realistic goal timeline and milestones\n"
            f"2. Appropriate training volume for fitness level\n"
            f"3. Equipment-constrained exercise options\n"
            f"4. Injury risk factors and contraindications\n"
            f"5. Recommended training phases (adaptation, building, peak, deload)\n"
            f"6. Daily calorie and macro targets for the goal"
        ),
        expected_output=(
            "Comprehensive assessment with:\n"
            "- Goal feasibility and milestones\n"
            "- Phase structure recommendation\n"
            "- Volume and intensity guidelines per phase\n"
            "- Exercise selection constraints\n"
            "- Nutrition targets\n"
            "- Contraindications for stated limitations"
        ),
        agent=agents["client_assessor"],
        context=[research_task],
    )

    design_task = Task(
        description=(
            f"Design a complete {timeframe} training program.\n\n"
            f"Using the research and assessment, create:\n"
            f"1. PHASES: Name each phase with focus and intensity level\n"
            f"2. WEEKS: Detail each week with theme\n"
            f"   - For programs >4 weeks: detail first 4 weeks fully, "
            f"summarize remaining weeks with themes and key progressions\n"
            f"3. DAYS: For each training day, include:\n"
            f"   - Title, focus area, duration\n"
            f"   - 4-8 exercises with sets, reps, rest, notes\n"
            f"   - Mark rest and active recovery days\n"
            f"4. Progressive overload: increase volume/intensity across weeks\n"
            f"5. Deload weeks every 3-4 weeks\n"
            f"6. Incorporate trending exercises from research\n\n"
            f"Parameters:\n"
            f"- {days_per_week} training days per week\n"
            f"- {session_duration} minutes per session\n"
            f"- Equipment: {equipment_str}\n"
            f"- Location: {location}\n\n"
            f"ALL TEXT IN HEBREW."
        ),
        expected_output=(
            "Complete program structure with phases, weeks, and daily workouts. "
            "Each exercise includes name, sets, reps, rest, notes — all in Hebrew."
        ),
        agent=agents["exercise_designer"],
        context=[research_task, assessment_task],
    )

    nutrition_task = Task(
        description=(
            f"Create a nutrition plan for this {timeframe} training program.\n\n"
            f"Client: {gender}, age {age or 'adult'}, weight {weight or 'unknown'} kg.\n"
            f"Goal: {goal_desc}.\n"
            f"Fitness level: {fitness_level}.\n\n"
            f"PROVIDE:\n"
            f"1. Daily calorie recommendation (adjusted per phase)\n"
            f"2. Protein target\n"
            f"3. 5-8 practical nutrition tips:\n"
            f"   - Pre/post workout nutrition\n"
            f"   - Meal timing\n"
            f"   - Hydration\n"
            f"   - Supplements (if appropriate)\n"
            f"   - Foods to emphasize and avoid\n"
            f"Keep recommendations practical and culturally relevant.\n"
            f"ALL IN HEBREW."
        ),
        expected_output=(
            "Nutrition plan with:\n"
            "- calories (Hebrew string)\n"
            "- protein (Hebrew string)\n"
            "- tips (5-8 Hebrew strings)"
        ),
        agent=agents["nutrition_advisor"],
        context=[design_task, assessment_task],
    )

    safety_task = Task(
        description=(
            f"Review the complete training program for safety.\n\n"
            f"Client: {gender}, age {age or 'adult'}, fitness level {fitness_level}.\n"
            f"Limitations: {limitations or 'none'}.\n"
            f"Duration: {timeframe}.\n\n"
            f"CHECK:\n"
            f"1. Volume progression is safe for {fitness_level} level\n"
            f"2. No overtraining risk (adequate rest days and deloads)\n"
            f"3. Exercises are appropriate for stated limitations\n"
            f"4. Progressive overload rate is sustainable\n"
            f"5. Phase transitions are gradual\n"
            f"6. Active recovery days are truly active recovery\n\n"
            f"Provide 2-4 safety notes for the program.\n"
            f"ALL NOTES IN HEBREW."
        ),
        expected_output=(
            "Safety review with:\n"
            "- Program-level safety assessment\n"
            "- 2-4 safety notes in Hebrew\n"
            "- Any modifications needed"
        ),
        agent=agents["safety_reviewer"],
        context=[design_task, assessment_task],
    )

    final_task = Task(
        description=(
            f"Assemble the final training program as structured JSON.\n\n"
            f"Combine all work into the final ProgramOutput:\n"
            f"1. Create a compelling Hebrew title and description\n"
            f"2. Apply any safety modifications\n"
            f"3. Include the nutrition plan\n"
            f"4. Add 3-5 general training tips (Hebrew)\n"
            f"5. Include safety notes (Hebrew)\n"
            f"6. Ensure all phases, weeks, and days are properly structured\n"
            f"7. Add your 'x factor' — motivational elements, progressive milestones\n\n"
            f"Program parameters:\n"
            f"- totalWeeks: based on {timeframe}\n"
            f"- daysPerWeek: {days_per_week}\n\n"
            f"The output MUST match the ProgramOutput schema exactly."
        ),
        expected_output="The complete training program as structured JSON matching ProgramOutput schema.",
        agent=agents["head_coach"],
        context=[design_task, nutrition_task, safety_task],
        output_pydantic=ProgramOutput,
    )

    return [research_task, assessment_task, design_task, nutrition_task, safety_task, final_task]
