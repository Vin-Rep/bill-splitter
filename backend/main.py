import base64
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import anthropic

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/upload")
async def upload_receipt(file: UploadFile = File(...)):
    contents = await file.read()
    image_data = base64.standard_b64encode(contents).decode("utf-8")

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": file.content_type,
                            "data": image_data,
                        },
                    },
                    {
                        "type": "text",
                        "text": """Extract all items from this receipt and return them as JSON only, no other text.
                        Use this exact format:
                        {
                            "items": [
                                {"name": "item name", "price": 0.00}
                            ],
                            "subtotal": 0.00,
                            "tax": 0.00,
                            "total": 0.00
                        }"""
                    }
                ],
            }
        ],
    )

    import json
    text = message.content[0].text
    text = text.strip()
    if text.startswith("```"):
        text = text.split("\n", 1)[1]
        text = text.rsplit("```", 1)[0]
        result = json.loads(text.strip())
    return result