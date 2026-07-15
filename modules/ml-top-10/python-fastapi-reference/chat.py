import json
import os
from typing import List

from dotenv import load_dotenv
from fastapi import APIRouter
from google import genai
from google.genai import types
from pydantic import BaseModel, Field

from algorithms import get_algorithm_by_slug

root_env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env")
if os.path.exists(root_env_path):
    load_dotenv(root_env_path)

load_dotenv()

router = APIRouter()
gemini_api_key = os.environ.get("GEMINI_API_KEY")
client = genai.Client(api_key=gemini_api_key) if gemini_api_key else None


class Message(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    user_id: str = "guest"
    algorithm_slug: str = "general"
    message: str
    history: List[Message] = Field(default_factory=list)


SYSTEM_PROMPT = """
You are an encouraging machine-learning tutor for students.
Answer in Traditional Chinese. Be concrete, concise, and beginner-friendly.
Return JSON only:
{
  "reply": "response text",
  "suggested_questions": ["question 1", "question 2", "question 3"],
  "assistant_state": "speaking"
}
"""


@router.post("/")
async def chat_with_assistant(request: ChatRequest):
    if client is None:
        return {
            "reply": "AI 助教尚未設定 GEMINI_API_KEY。你仍然可以瀏覽演算法卡片、收藏與進度。",
            "suggested_questions": [
                "這個演算法適合用在哪些情境？",
                "它和其他演算法有什麼差異？",
                "可以用簡單例子解釋嗎？",
            ],
            "assistant_state": "confused",
        }

    algo_context = ""
    try:
        if request.algorithm_slug and request.algorithm_slug != "general":
            algo_data = get_algorithm_by_slug(request.algorithm_slug)
            algo_context = (
                "\n\nCurrent algorithm:\n"
                f"Name: {algo_data.get('name_en', '')}\n"
                f"Slug: {algo_data.get('slug', '')}\n"
                f"Visual type: {algo_data.get('visual_type', '')}\n"
            )
    except Exception:
        algo_context = ""

    contents = []
    for msg in request.history[-5:]:
        role = "model" if msg.role == "assistant" else "user"
        contents.append(
            types.Content(
                role=role,
                parts=[types.Part.from_text(text=msg.content)],
            )
        )
    contents.append(
        types.Content(
            role="user",
            parts=[types.Part.from_text(text=request.message)],
        )
    )

    try:
        response = await client.aio.models.generate_content(
            model=os.environ.get("GEMINI_MODEL", "gemini-2.5-flash"),
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT + algo_context,
                temperature=0.7,
                response_mime_type="application/json",
            ),
        )
        result = json.loads(response.text or "{}")
        return {
            "reply": result.get("reply", "我現在無法產生完整回覆，請再試一次。"),
            "suggested_questions": result.get("suggested_questions", []),
            "assistant_state": result.get("assistant_state", "speaking"),
        }
    except Exception as exc:
        print(f"Gemini API Error: {exc}")
        return {
            "reply": "AI 助教目前無法連線，請稍後再試。",
            "suggested_questions": [],
            "assistant_state": "confused",
        }
