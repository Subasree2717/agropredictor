import numpy as np
import joblib
from tensorflow.keras.models import load_model  # type: ignore
import random

# Load model and scaler
lstm_model = load_model('models/lstm_weather_model.h5', compile=False)
scaler = joblib.load('models/minmax_scaler.save')

EXPECTED_FEATURES = scaler.n_features_in_

def predict_next_7_days(current_weather):
    try:
        if len(current_weather) != EXPECTED_FEATURES:
            return {
                "error": f"❌ Feature count mismatch: expected {EXPECTED_FEATURES}, got {len(current_weather)}"
            }

        # Scale input
        scaled_input = scaler.transform([current_weather])
        input_seq = np.reshape(scaled_input, (1, 1, EXPECTED_FEATURES))
        predictions = []

        # Temperature scaling bounds
        temp_min = scaler.data_min_[0]
        temp_max = scaler.data_max_[0]

        for i in range(7):
            pred = lstm_model.predict(input_seq, verbose=0)
            print(f"[ℹ️] Model predicted shape: {pred.shape}, value: {pred}")

            scaled_temp = pred[0, 0]
            clipped = np.clip(scaled_temp, 0, 1)
            temperature = temp_min + clipped * (temp_max - temp_min)

            # 🌀 Random weather condition
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
