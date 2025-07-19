import os
from dotenv import load_dotenv
from google.generativeai import configure, GenerativeModel

# Load API key from .env
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# ✅ Configure Gemini
configure(api_key=GOOGLE_API_KEY)

# ✅ Use the Gemini model (you can also use "gemini-1.5-pro-latest")
model = GenerativeModel("gemini-1.5-flash")

# ✅ Optional fallback logic if Gemini fails
def fallback_logic(user_input: str) -> str:
    user_input = user_input.lower()

    if any(word in user_input for word in ["fertilizer", "npk", "manure"]):
        return "Use NPK or organic compost for optimal results depending on the crop."
    elif any(word in user_input for word in ["soil", "clay", "sandy"]):
        return "Loamy soil is ideal for most crops due to its drainage and nutrient balance."
    elif any(word in user_input for word in ["water", "watering", "irrigation"]):
        return "Water early in the morning or late evening to reduce evaporation."
    elif any(word in user_input for word in ["weather", "rain", "sunny"]):
        return "You can check the live weather and 7-day forecast using our weather feature."
    elif any(word in user_input for word in ["crop", "plant", "grow"]):
        return "You can try our Crop Predictor tool based on your soil and weather conditions."
    else:
        return "I'm still learning! Please ask about soil, fertilizer, watering, or crops."

# ✅ Main chatbot function used by Flask backend
def get_chatbot_response(user_input: str) -> str:
    try:
        response = model.generate_content(user_input)
        reply = response.text.strip()
        if not reply:
            raise ValueError("Empty Gemini response")
        return reply
    except Exception as e:
        print(f"[⚠️ Gemini Fallback Triggered]: {e}")
        return fallback_logic(user_input)
