import numpy as np
import joblib
import os
import gdown
from dotenv import load_dotenv
from tensorflow.keras.models import load_model  # type: ignore

# Load environment variables
load_dotenv()

# Ensure model directory exists
MODEL_DIR = "models/"
os.makedirs(MODEL_DIR, exist_ok=True)

# 📦 Function to download from Google Drive using file ID
def download_from_drive(file_id, filename):
    dest_path = os.path.join(MODEL_DIR, filename)
    if not os.path.exists(dest_path):
        url = f"https://drive.google.com/uc?id={file_id}"
        print(f"[⬇️] Downloading {filename} from Google Drive...")
        gdown.download(url, dest_path, quiet=False)
    else:
        print(f"[✅] {filename} already exists.")
    return dest_path

# 🔁 Download model + scaler using IDs from .env
LSTM_MODEL_PATH = download_from_drive(os.getenv("LSTM_MODEL_ID"), "lstm_weather_model.h5")
SCALER_PATH = download_from_drive(os.getenv("SCALER_ID"), "minmax_scaler.save")

# 🔄 Load the model and scaler
lstm_model = load_model(LSTM_MODEL_PATH, compile=False)
scaler = joblib.load(SCALER_PATH)

EXPECTED_FEATURES = scaler.n_features_in_

# 🌦️ LSTM Weather Prediction Function
def predict_next_7_days(current_weather):
    try:
        if len(current_weather) != EXPECTED_FEATURES:
            return {
                "error": f"❌ Feature count mismatch: expected {EXPECTED_FEATURES}, got {len(current_weather)}"
            }

        scaled_input = scaler.transform([current_weather])
        input_seq = np.reshape(scaled_input, (1, 1, EXPECTED_FEATURES))
        predictions = []

        temp_min = scaler.data_min_[0]
        temp_max = scaler.data_max_[0]

        for i in range(7):
            pred = lstm_model.predict(input_seq, verbose=0)
            scaled_temp = pred[0, 0]
            clipped = np.clip(scaled_temp, 0, 1)
            temperature = temp_min + clipped * (temp_max - temp_min)

            if temperature > 32:
                condition = "Sunny"
            elif temperature > 28:
                condition = "Partly Cloudy"
            else:
                condition = "Rain"

            forecast = {
                "day": f"Day {i + 1}",
                "temperature": round(temperature, 2),
                "condition": condition
            }

            predictions.append(forecast)

            # Prepare next input
            padded_input = np.zeros((1, EXPECTED_FEATURES))
            padded_input[0, 0] = scaled_temp
            input_seq = np.reshape(padded_input, (1, 1, EXPECTED_FEATURES))

        return predictions

    except Exception as e:
        print(f"[❌] LSTM prediction error: {e}")
        return {"error": "Failed to predict weather forecast"}
