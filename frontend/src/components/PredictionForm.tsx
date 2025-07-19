import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sprout } from 'lucide-react';

const soilTypes = [
  'Sandy',
  'Loamy',
  'Black',
  'Red',
  'Clayey',
];

interface PredictionResult {
  crop: string;
  fertilizer: string;
}

export function PredictionForm() {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [formData, setFormData] = useState({
    temperature: '',
    humidity: '',
    moisture: '',
    soil_type: '',
    nitrogen: '',
    potassium: '',
    phosphorous: '',
  });
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to get prediction');
      }

      const data = await response.json();
      setPrediction({
  crop: data.predicted_crop,
  fertilizer: data.predicted_fertilizer,
});

      
      toast({
        title: "Prediction successful!",
        description: "Your crop and fertilizer recommendations are ready.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Prediction failed",
        description: "Unable to connect to the prediction service. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sprout className="h-5 w-5 text-agricultural-green" />
            Crop & Fertilizer Prediction
          </CardTitle>
          <CardDescription>
            Enter your soil and environmental data to get crop and fertilizer recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  value={formData.temperature}
                  onChange={(e) => handleInputChange('temperature', e.target.value)}
                  placeholder="25"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="humidity">Humidity (%)</Label>
                <Input
                  id="humidity"
                  type="number"
                  value={formData.humidity}
                  onChange={(e) => handleInputChange('humidity', e.target.value)}
                  placeholder="80"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="moisture">Moisture (%)</Label>
                <Input
                  id="moisture"
                  type="number"
                  value={formData.moisture}
                  onChange={(e) => handleInputChange('moisture', e.target.value)}
                  placeholder="70"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="soil_type">Soil Type</Label>
                <Select value={formData.soil_type} onValueChange={(value) => handleInputChange('soil_type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select soil type" />
                  </SelectTrigger>
                  <SelectContent>
                    {soilTypes.map((soil) => (
                      <SelectItem key={soil} value={soil}>
                        {soil}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nitrogen">Nitrogen (N)</Label>
                <Input
                  id="nitrogen"
                  type="number"
                  value={formData.nitrogen}
                  onChange={(e) => handleInputChange('nitrogen', e.target.value)}
                  placeholder="90"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="potassium">Potassium (K)</Label>
                <Input
                  id="potassium"
                  type="number"
                  value={formData.potassium}
                  onChange={(e) => handleInputChange('potassium', e.target.value)}
                  placeholder="43"
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="phosphorous">Phosphorous (P)</Label>
                <Input
                  id="phosphorous"
                  type="number"
                  value={formData.phosphorous}
                  onChange={(e) => handleInputChange('phosphorous', e.target.value)}
                  placeholder="20"
                  required
                />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Get Prediction
            </Button>
          </form>
        </CardContent>
      </Card>

      {prediction && (
        <Card>
          <CardHeader>
            <CardTitle className="text-agricultural-green">Prediction Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-agricultural-light rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Recommended Crop</h3>
                <p className="text-2xl font-bold text-agricultural-green">{prediction.crop}</p>
              </div>
              <div className="p-4 bg-agricultural-light rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Recommended Fertilizer</h3>
                <p className="text-2xl font-bold text-agricultural-gold">{prediction.fertilizer}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}