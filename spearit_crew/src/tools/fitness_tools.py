from crewai.tools import BaseTool
from pydantic import BaseModel, Field


class ExerciseDatabaseInput(BaseModel):
    category: str = Field(description="Exercise category: Warm-Up, Core, Strength, Flexibility, Cool-Down")
    equipment: str = Field(default="none", description="Available equipment")
    age_group: str = Field(default="adults", description="Target age group")


class ExerciseDatabaseTool(BaseTool):
    name: str = "exercise_database"
    description: str = (
        "Query the built-in exercise database for exercises by category, "
        "equipment, and age group. Returns a curated list of exercises with "
        "Hebrew names and descriptions."
    )
    args_schema: type[BaseModel] = ExerciseDatabaseInput

    def _run(self, category: str, equipment: str = "none", age_group: str = "adults") -> str:
        exercises = {
            "Warm-Up": [
                {"name": "הליכה במקום", "description": "הליכה במקום עם תנועות ידיים", "equipment": "ללא"},
                {"name": "סיבובי כתפיים", "description": "סיבובים קדימה ואחורה", "equipment": "ללא"},
                {"name": "מתיחות דינמיות", "description": "מתיחות בתנועה לחימום השרירים", "equipment": "ללא"},
                {"name": "ריצה קלה במקום", "description": "ריצה קלה להעלאת הדופק", "equipment": "ללא"},
                {"name": "סיבובי ירכיים", "description": "סיבובי ירכיים לחימום המפרקים", "equipment": "ללא"},
                {"name": "קפיצות קטנות", "description": "קפיצות קלות במקום", "equipment": "ללא"},
            ],
            "Core": [
                {"name": "פלאנק", "description": "החזקה בתנוחת שכיבת סמיכה על האמות", "equipment": "מזרן"},
                {"name": "כפיפות בטן", "description": "כפיפות בטן קלאסיות", "equipment": "מזרן"},
                {"name": "סיבובי פלג גוף עליון", "description": "סיבובים עם הידיים על החזה", "equipment": "מזרן"},
                {"name": "Dead Bug", "description": "שכיבה על הגב עם תנועות ידיים ורגליים מנוגדות", "equipment": "מזרן"},
                {"name": "גשר ירכיים", "description": "הרמת אגן בשכיבה על הגב", "equipment": "מזרן"},
                {"name": "Bird Dog", "description": "על ארבע — הרמת יד ורגל מנוגדים", "equipment": "מזרן"},
            ],
            "Strength": [
                {"name": "סקוואט", "description": "כריעה עם משקל גוף", "equipment": "ללא"},
                {"name": "שכיבות סמיכה", "description": "שכיבות סמיכה קלאסיות או מותאמות", "equipment": "ללא"},
                {"name": "לאנג'ים", "description": "צעדים קדימה עם כריעה", "equipment": "ללא"},
                {"name": "הרמות משקולת", "description": "הרמות עם משקולות קלות", "equipment": "משקולות קלות"},
                {"name": "שורות משקולת", "description": "משיכת משקולות כלפי הגוף", "equipment": "משקולות קלות"},
                {"name": "כפיפות יד עם גומייה", "description": "כפיפות יד עם גומיית התנגדות", "equipment": "גומיית התנגדות"},
            ],
            "Flexibility": [
                {"name": "מתיחת ארבע ראשי", "description": "מתיחת שריר הירך הקדמי", "equipment": "ללא"},
                {"name": "מתיחת גב תחתון", "description": "מתיחת שרירי הגב התחתון", "equipment": "מזרן"},
                {"name": "Cat-Cow", "description": "תנועת חתול-פרה לגמישות עמוד השדרה", "equipment": "מזרן"},
                {"name": "מתיחת שרירי ירך אחוריים", "description": "מתיחה בישיבה או בעמידה", "equipment": "ללא"},
                {"name": "פתיחת חזה", "description": "מתיחת שרירי החזה והכתפיים", "equipment": "ללא"},
                {"name": "מתיחת פירפורמיס", "description": "מתיחת שריר עמוק באגן", "equipment": "מזרן"},
            ],
            "Cool-Down": [
                {"name": "נשימות עמוקות", "description": "נשימות איטיות ועמוקות להרגעה", "equipment": "ללא"},
                {"name": "מתיחות סטטיות", "description": "מתיחות ארוכות לכל קבוצות השרירים", "equipment": "מזרן"},
                {"name": "גלגול קצף", "description": "שחרור שרירים עם רולר קצף", "equipment": "רולר קצף"},
                {"name": "שוואסנה", "description": "שכיבה על הגב ברוגע מוחלט", "equipment": "מזרן"},
                {"name": "מדיטציה קצרה", "description": "מדיטציה של דקה להרגעת הגוף והנפש", "equipment": "ללא"},
            ],
        }

        category_exercises = exercises.get(category, exercises.get("Core", []))

        if equipment != "none":
            filtered = [e for e in category_exercises if equipment in e["equipment"] or e["equipment"] == "ללא"]
            if filtered:
                category_exercises = filtered

        import json
        return json.dumps(category_exercises, ensure_ascii=False)
