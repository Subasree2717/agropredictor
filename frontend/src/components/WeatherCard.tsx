import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CloudRain, Thermometer, Droplets, AlertTriangle, CalendarDays } from 'lucide-react';

interface WeatherData {
  temperature: number;
  humidity: number;
  description: string;
}

interface ForecastDay {
  day: string;
  temperature: number;
  condition: string;
}

export function WeatherCard() {
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[] | null>(null);
  const [city, setCity] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setWeather(null);
    setForecast(null);

    try {
      // Step 1: Get current weather
      const weatherResponse = await fetch(`http://127.0.0.1:5000/weather?city=${encodeURIComponent(city)}`);
      if (!weatherResponse.ok) throw new Error('Failed to fetch current weather');
      const weatherData = await weatherResponse.json();

      if (weatherData.error) {
        toast({
          variant: 'destructive',
          title: 'City not found',
          description: 'Please check the city name and try again.',
        });
        return;
      }

      setWeather(weatherData);

      // Step 2: Fetch 7-day forecast from backend
      const forecastResponse = await fetch(
        `http://127.0.0.1:5000/forecast?temperature=${weatherData.temperature}&humidity=${weatherData.humidity}`
      );
      if (!forecastResponse.ok) throw new Error('Failed to fetch forecast');

      const forecastData = await forecastResponse.json();
      setForecast(forecastData.forecast);

      toast({
        title: 'Weather data retrieved!',
        description: `Weather and 7-day forecast for ${city} available.`,
      });

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        variant: 'destructive',
        title: 'Fetch failed',
        description: 'Check backend connection and try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CloudRain className="h-5 w-5 text-blue-500" />
            Weather Information
          </CardTitle>
          <CardDescription>
            Get current weather and 7-day forecast to plan your farming
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="city">City Name</Label>
              <Input
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name"
                required
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Get Weather
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Current Weather Display */}
      {weather && (
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-600 dark:text-blue-400">
              Weather Report for {city}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 p-4 bg-agricultural-light rounded-lg">
                <Thermometer className="h-8 w-8 text-red-500" />
                <div>
                  <h3 className="font-semibold">Temperature</h3>
                  <p className="text-2xl font-bold">{weather.temperature}°C</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-agricultural-light rounded-lg">
                <Droplets className="h-8 w-8 text-blue-500" />
                <div>
                  <h3 className="font-semibold">Humidity</h3>
                  <p className="text-2xl font-bold">{weather.humidity}%</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Weather Description</h3>
              <p className="text-blue-700 dark:text-blue-300">{weather.description}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 7 Day Forecast Display */}
      {forecast && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CalendarDays className="h-6 w-6" />
              7-Day Forecast
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {forecast.map((day) => (
              <div key={day.day} className="p-4 border rounded-lg shadow bg-emerald-50 dark:bg-emerald-900/20">
                <h4 className="font-semibold text-lg mb-2">{day.day}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Temperature: {day.temperature}°C</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Condition: {day.condition}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
