from flask import Flask, request, jsonify
import joblib
import numpy as np
from utils.weather import get_weather_data
from utils.chatbot import get_chatbot_response
from utils.supabase_client import supabase
from flask_cors import CORS
import google.generativeai as genai
from utils.weather import predict_next_7_days
from utils.weather import weather_bp
from dotenv import load_dotenv
import os



load_dotenv()  # Load .env variables

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")


GENAI_API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=GENAI_API_KEY)



# ✅ Initialize Flask app only ONCE
app = Flask(__name__)
CORS(app)
app.register_blueprint(weather_bp)

# ✅ Load trained models and encoders
crop_model = joblib.load('models/crop_model.pkl')
fertilizer_model = joblib.load('models/fertilizer_model.pkl')
crop_encoder = joblib.load('models/crop_label_encoder.pkl')
fertilizer_encoder = joblib.load('models/fertilizer_label_encoder.pkl')
soil_encoder = joblib.load('models/soil_label_encoder.pkl')

# ✅ Home route
@app.route('/')
def home():
    return jsonify({"message": "AgroPredictor API is running ✅"})



# ✅ Combined Chat Route


@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    message = data.get("message")

    try:
        # ✅ Ensure Gemini is configured with correct key
        response = genai.chat(model="gemini-pro").send_message(message)
        answer = response.text.strip()

        # Fallback if Gemini gives empty response
        if not answer:
            raise ValueError("Empty response from Gemini")

    except Exception as e:
        print(f"[⚠️ Gemini failed]: {e}")
        answer = get_chatbot_response(message)

    # Save to Supabase
    supabase.table('chat_history').insert({
        "user_message": message,
        "bot_response": answer
    }).execute()

    return jsonify({"response": answer})

# ✅ Predict Crop and Fertilizer
@app.route('/predict', methods=['POST'])
def predict_crop_fertilizer():
    try:
        data = request.json
        temperature = data['temperature']
        humidity = data['humidity']
        moisture = data['moisture']
        soil_type = data['soil_type']
        nitrogen = data['nitrogen']
        potassium = data['potassium']
        phosphorous = data['phosphorous']

        # Encode soil type
        soil_encoded = soil_encoder.transform([soil_type])[0]

        # Prepare input arrays
        crop_input = np.array([[temperature, humidity, moisture, soil_encoded, nitrogen, potassium, phosphorous]])
        fertilizer_input = np.array([[temperature, humidity, moisture, soil_encoded, 0, nitrogen, potassium, phosphorous]])

        # Predict Crop
        crop_pred = crop_model.predict(crop_input)
        crop_name = crop_encoder.inverse_transform(crop_pred)[0]

        # Add Crop to fertilizer input
        fertilizer_input[0][4] = crop_pred[0]

        # Predict Fertilizer
        fert_pred = fertilizer_model.predict(fertilizer_input)
        fert_name = fertilizer_encoder.inverse_transform(fert_pred)[0]

        # Save prediction to Supabase
        supabase.table('predictions').insert({
            "temperature": temperature,
            "humidity": humidity,
            "moisture": moisture,
            "soil_type": soil_type,
            "nitrogen": nitrogen,
            "potassium": potassium,
            "phosphorous": phosphorous,
            "predicted_crop": crop_name,
            "predicted_fertilizer": fert_name
        }).execute()

        return jsonify({
            "predicted_crop": crop_name,
            "predicted_fertilizer": fert_name
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ✅ Weather Route
@app.route('/weather', methods=['GET', 'POST'])
def get_weather():
    if request.method == 'POST':
        city = request.json.get('city')
    else:  # GET
        city = request.args.get('city')

    if not city:
        return jsonify({"error": "City parameter is required"}), 400

    weather_data = get_weather_data(city)
    return jsonify(weather_data)


# ✅ Forecast Route
@app.route('/forecast', methods=['GET'])
def forecast_weather():
    try:
        temperature = float(request.args.get('temperature'))
        humidity = float(request.args.get('humidity'))
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid or missing temperature/humidity"}), 400

    forecast_data = predict_next_7_days(temperature, humidity)
    return jsonify({"forecast": forecast_data})


# ✅ Run App
if __name__ == "__main__":
    app.run(debug=True, port=5000)  # Use port 5000 for React frontend compatibility
