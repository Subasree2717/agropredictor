import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface Forecast {
  date: string;
  predicted_tempmax: number;
  humidity: number;
  wind_speed: number;
  predicted_weather: string;
}

export function ForecastCard() {
  const [forecast, setForecast] = useState<Forecast[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchForecast = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://127.0.0.1:5000/forecast");
        const data = await response.json();
        setForecast(data.forecast);
      } catch (error) {
        console.error("Error fetching forecast:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>🌤️ 7-Day Weather Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="animate-spin h-8 w-8" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {forecast.map((day) => (
              <div
                key={day.date}
                className="p-4 border rounded-lg bg-agricultural-light shadow"
              >
                <h3 className="font-bold text-lg">{day.date}</h3>
                <p>🌡️ Temp Max: {day.predicted_tempmax}°C</p>
                <p>💧 Humidity: {day.humidity}%</p>
                <p>💨 Wind: {day.wind_speed} km/h</p>
                <p>🌤️ Weather: {day.predicted_weather}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
