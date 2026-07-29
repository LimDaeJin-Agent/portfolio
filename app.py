import json
import os
import requests
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.responses import FileResponse, JSONResponse

load_dotenv()

API_KEY = os.environ.get("GEMINI_API_KEY")
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/interactions"

app = FastAPI()


def build_saju_prompt(birth_info: dict) -> str:
    # TODO: 실제 사주(생년월일시/음양력/성별)를 반영한 프롬프트로 다듬기
    return (
        f"이름: {birth_info.get('name') or '익명'}\n"
        f"생년월일: {birth_info.get('birthDate')}\n"
        f"태어난 시간: {birth_info.get('birthTime') or '모름'}\n"
        f"성별: {birth_info.get('gender')}\n"
        "위 정보를 바탕으로 간단한 사주를 봐줘."
    )


def build_student_profile(data: dict) -> dict:
    return {
        "내신 평균 등급": data.get("naesinAvg"),
        "세부활동": data.get("activities") or "제공 안 함",
        "국어 표준점수": data.get("korScore"),
        "수학 표준점수": data.get("mathScore"),
        "수학 선택과목": data.get("mathType"),
        "영어 등급": data.get("engGrade"),
        "탐구1": {"과목": data.get("elective1Name"), "표준점수": data.get("elective1Score")},
        "탐구2": {"과목": data.get("elective2Name"), "표준점수": data.get("elective2Score")},
        "한국사 등급": data.get("historyGrade"),
        "희망 계열": data.get("interestField") or "제한 없음",
    }


def build_prediction_prompt(profile: dict) -> str:
    return f"""너는 대한민국 대입 입시 컨설턴트다. 아래 학생 정보를 참고해서
1) 이 학생의 수능/내신 조합으로 현실적으로 지원 가능한 대학-학과를
   상향/적정/안정 3단계로 나눠 각 단계별 2~3개씩 추천하고,
2) 각 학과별로 졸업 후 학점 구간(3.0 미만/3.0~3.5/3.5~4.0/4.0 이상)에 따른
   취업률과 예상 연봉을 추정하라.

반드시 지켜야 할 규칙:
- 확실하지 않은 수치는 절대 단정하지 말고 범위(예: 65~75%)로 제시할 것
- 절대 확답형 문장("합격합니다", "취업이 보장됩니다") 사용 금지
- 근거가 빈약하면 confidence를 "low"로 표시할 것
- disclaimer 필드에 "본 결과는 AI의 추정이며 실제 입시 결과·취업 통계와 다를 수 있습니다. 참고용으로만 활용하세요." 문구를 반드시 포함할 것

학생 정보: {json.dumps(profile, ensure_ascii=False)}

아래 JSON 스키마로만 응답하라 (설명 문구, 코드블록 없이 순수 JSON만 출력):
{{
  "recommendations": [
    {{
      "tier": "상향|적정|안정",
      "university": "string",
      "department": "string",
      "admission_probability_range": "string",
      "reasoning": "string",
      "employment_by_gpa": [
        {{"gpa_range": "3.0 미만", "employment_rate_range": "string", "expected_salary_range": "string"}},
        {{"gpa_range": "3.0~3.5", "employment_rate_range": "string", "expected_salary_range": "string"}},
        {{"gpa_range": "3.5~4.0", "employment_rate_range": "string", "expected_salary_range": "string"}},
        {{"gpa_range": "4.0 이상", "employment_rate_range": "string", "expected_salary_range": "string"}}
      ],
      "confidence": "low|medium|high"
    }}
  ],
  "disclaimer": "string"
}}"""


def call_gemini(prompt: str) -> str:
    response = requests.post(
        GEMINI_URL,
        headers={
            "x-goog-api-key": API_KEY,
            "Content-Type": "application/json",
        },
        json={
            "model": "gemini-3.5-flash",
            "input": prompt,
        },
        timeout=60,
    )
    response.raise_for_status()
    data = response.json()

    for step in data["steps"]:
        if step["type"] == "model_output":
            return step["content"][0]["text"]
    return ""


def parse_json_response(text: str) -> dict:
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.strip("`")
        if cleaned.startswith("json"):
            cleaned = cleaned[4:]
    return json.loads(cleaned)


@app.get("/")
def index():
    return FileResponse("saju.html")


@app.get("/admission")
def admission_page():
    return FileResponse("admission.html")


@app.post("/api/saju")
async def saju(request: Request):
    birth_info = await request.json()
    prompt = build_saju_prompt(birth_info)
    # TODO: 에러 처리, 결과 파싱/포맷 다듬기
    result_text = call_gemini(prompt)
    return {"result": result_text}


@app.post("/api/predict")
async def predict(request: Request):
    data = await request.json()
    profile = build_student_profile(data)
    prompt = build_prediction_prompt(profile)
    raw_text = call_gemini(prompt)
    try:
        result = parse_json_response(raw_text)
    except (json.JSONDecodeError, ValueError):
        return JSONResponse(
            status_code=502,
            content={"error": "Gemini 응답을 JSON으로 파싱하지 못했습니다.", "raw": raw_text},
        )
    return result
