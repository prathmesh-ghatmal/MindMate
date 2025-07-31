import os
from openai import OpenAI
from app.core.config import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY)

SYSTEM_PROMPT = """You are MindMate, a mental wellness chatbot.
✅ Help with emotional support, CBT-style reflection, stress management.
❌ Do NOT solve math, programming, or technical questions.
If asked unrelated queries, politely say:
"I'm here for mental wellness. Let's focus on how you're feeling." """

async def get_mental_health_reply(context_messages, new_message, summary=None):
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
    ]

    # ✅ If there’s a stored summary, prepend it
    if summary:
        messages.append({
            "role": "system",
            "content": f"Here’s what you already know about the user: {summary}"
        })

    # ✅ Add last 10 messages for short-term context
    for msg in context_messages[-10:]:
        messages.append({"role": msg["sender"], "content": msg["text"]})

    # ✅ Add new message
    messages.append({"role": "user", "content": new_message})

    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=messages
    )

    return completion.choices[0].message.content

async def summarize_conversation(all_messages):
    """
    Takes all messages (plaintext) and returns a 2-3 sentence summary.
    """
    summary_prompt = [
        {
            "role": "system",
            "content": "Summarize this conversation in 2-3 sentences focusing on user's feelings and key topics."
        },
        {
            "role": "user",
            "content": "\n".join(
                [f"{m['sender']}: {m['text']}" for m in all_messages]
            )
        }
    ]

    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=summary_prompt
    )

    return completion.choices[0].message.content
