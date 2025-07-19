import os
import requests
from dotenv import load_dotenv
from flask import Blueprint, request, jsonify
from utils.model_utils import predict_next_7_days

# Load .env variables
load_dotenv()

# Create the blueprint once
weather_bp = Blueprint("weather", __name__)

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")

def get_weather_data(city):
    """
    Fetch weather data from OpenWeather API
    """
    if not OPENWEATHER_API_KEY:
        return {"error": "OpenWeather API key not configured"}
    
    url = (
        f"http://api.openweathermap.org/data/2.5/weather?"
        f"q={city}&appid={OPENWEATHER_API_KEY}&units=metric"
    )
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        return {
            "temperature": data['main']['temp'],
            "humidity": data['main']['humidity'],
            "description": data['weather'][0]['description'].capitalize()
        }
    else:
        return {"error": "City not found or API error"}

@weather_bp.route("/weather", methods=["GET"])
def get_weather():
    city = request.args.get("city")
    if not city:
        return jsonify({"error": "City is required"}), 400
    weather_data = get_weather_data(city)
    return jsonify(weather_data)

@weather_bp.route("/forecast", methods=["GET"])
def get_7_day_forecast():
    try:
        temperature = float(request.args.get("temperature"))
        humidity = float(request.args.get("humidity"))
        
         # Set remaining 4 features with default averages from dataset
        pressure = 1010       # Replace with mean from dataset
        wind_speed = 2.5      # Replace with mean from dataset
        visibility = 8000     # Replace with mean from dataset
        cloud_cover = 40      # Replace with mean from dataset

      
        if temperature is None or humidity is None:
            return jsonify({"error": "temperature and humidity parameters are required"}), 400
 # Must match order of features used in training
        current_weather = [temperature, humidity, pressure, wind_speed, visibility, cloud_cover]

        forecast = predict_next_7_days(current_weather)
        if "error" in forecast:
            return jsonify({"error": forecast["error"]}), 500

        return jsonify({"forecast": forecast})

    except ValueError:
        return jsonify({"error": "Invalid temperature or humidity value"}), 400
    except Exception as e:
        print(f"[❌] Forecast API error: {e}")
        return jsonify({"error": "Server error while predicting forecast"}), 500
