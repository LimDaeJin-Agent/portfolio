import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.environ.get("GEMINI_API_KEY")
URL = "https://generativelanguage.googleapis.com/v1beta/interactions"


def ask_gemini(text: str) -> str:
    response = requests.post(
        URL,
        headers={
            "x-goog-api-key": API_KEY,
            "Content-Type": "application/json",
        },
        json={
            "model": "gemini-3.5-flash",
            "input": text,
        },
    )
    response.raise_for_status()
    data = response.json()

    for step in data["steps"]:
        if step["type"] == "model_output":
            return step["content"][0]["text"]
    return ""


if __name__ == "__main__":
    user_text = input("텍스트를 입력하세요: ")
    print(ask_gemini(user_text))