
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Ruler } from "lucide-react";

// Dati di esempio per le misure antropometriche nel tempo
const measurementProgressData = [
  {
    date: "Gen 2024",
    braccio: 32.0,
    polso: 17.5,
    petto: 95.0,
    spalle: 112.0,
    vita: 85.0,
    fianchi: 98.0,
    radCoscia: 58.0,
    medCoscia: 45.0,
    ginocchio: 38.0,
    caviglia: 23.0
  },
  {
    date: "Feb 2024",
    braccio: 33.0,
    polso: 17.5,
    petto: 93.0,
    spalle: 110.5,
    vita: 83.0,
    fianchi: 96.0,
    radCoscia: 57.0,
    medCoscia: 44.5,
    ginocchio: 37.5,
    caviglia: 22.8
  },
  {
    date: "Mar 2024",
    braccio: 34.0,
    polso: 17.8,
    petto: 91.0,
    spalle: 109.0,
    vita: 81.0,
    fianchi: 94.0,
    radCoscia: 56.0,
    medCoscia: 44.0,
    ginocchio: 37.0,
    caviglia: 22.5
  },
  {
    date: "Apr 2024",
    braccio: 35.0,
    polso: 18.0,
    petto: 89.0,
    spalle: 107.5,
    vita: 79.0,
    fianchi: 92.0,
    radCoscia: 55.0,
    medCoscia: 43.5,
    ginocchio: 36.5,
    caviglia: 22.2
  },
  {
    date: "Mag 2024",
    braccio: 36.0,
    polso: 18.2,
    petto: 87.0,
    spalle: 106.0,
    vita: 77.0,
    fianchi: 90.0,
    radCoscia: 54.0,
    medCoscia: 43.0,
    ginocchio: 36.0,
    caviglia: 22.0
  }
];

const bodyCompositionProgressData = [
  {
    date: "Gen 2024",
    fat: 25.2,
    ffm: 58.3,
    tbw: 42.6,
    icw: 25.6,
    ecw: 17.0,
    bcm: 43.7,
    bmr: 1756
  },
  {
    date: "Feb 2024",
    fat: 24.1,
    ffm: 59.1,
    tbw: 43.1,
    icw: 25.9,
    ecw: 17.2,
    bcm: 44.3,
    bmr: 1798
  },
  {
    date: "Mar 2024",
    fat: 22.8,
    ffm: 60.2,
    tbw: 43.9,
    icw: 26.3,
    ecw: 17.6,
    bcm: 45.2,
    bmr: 1824
  },
  {
    date: "Apr 2024",
    fat: 21.5,
    ffm: 61.5,
    tbw: 44.9,
    icw: 26.9,
    ecw: 18.0,
    bcm: 46.1,
    bmr: 1853
  },
  {
    date: "Mag 2024",
    fat: 20.2,
    ffm: 62.8,
    tbw: 45.8,
    icw: 27.5,
    ecw: 18.3,
    bcm: 47.1,
    bmr: 1882
  }
];

const ProgressCharts = () => {
  return (
    <div className="space-y-6">
      {/* Grafico Misure Antropometriche */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center">
            <Ruler className="w-5 h-5 mr-2" />
            Progressi Misure Antropometriche (cm)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-80 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={measurementProgressData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="petto" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Petto (cm)"
                />
                <Line 
                  type="monotone" 
                  dataKey="vita" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Vita (cm)"
                />
                <Line 
                  type="monotone" 
                  dataKey="fianchi" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  name="Fianchi (cm)"
                />
                <Line 
                  type="monotone" 
                  dataKey="braccio" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  name="Braccio (cm)"
                />
                <Line 
                  type="monotone" 
                  dataKey="radCoscia" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Coscia (cm)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Variazioni delle misure */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Petto</p>
              <p className="text-lg font-bold text-blue-600">-8.0 cm</p>
              <p className="text-xs text-green-600">↓ Riduzione</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Vita</p>
              <p className="text-lg font-bold text-green-600">-8.0 cm</p>
              <p className="text-xs text-green-600">↓ Miglioramento</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm text-gray-600">Fianchi</p>
              <p className="text-lg font-bold text-yellow-600">-8.0 cm</p>
              <p className="text-xs text-green-600">↓ Riduzione</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Braccio</p>
              <p className="text-lg font-bold text-purple-600">+4.0 cm</p>
              <p className="text-xs text-green-600">↑ Crescita muscolare</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-600">Coscia</p>
              <p className="text-lg font-bold text-red-600">-4.0 cm</p>
              <p className="text-xs text-green-600">↓ Riduzione</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Periodo</p>
              <p className="text-lg font-bold text-gray-800">5 mesi</p>
              <p className="text-xs text-blue-600">Monitoraggio</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grafico Composizione Corporea */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Progressi Composizione Corporea
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-80 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={bodyCompositionProgressData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="fat" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Massa Grassa (%)"
                />
                <Line 
                  type="monotone" 
                  dataKey="ffm" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  name="Massa Magra (kg)"
                />
                <Line 
                  type="monotone" 
                  dataKey="tbw" 
                  stroke="#06b6d4" 
                  strokeWidth={2}
                  name="Acqua Totale (L)"
                />
                <Line 
                  type="monotone" 
                  dataKey="bcm" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Massa Cellulare (kg)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-600">Massa Grassa</p>
              <p className="text-lg font-bold text-red-600">-5.0%</p>
              <p className="text-xs text-green-600">↓ Riduzione</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Massa Magra</p>
              <p className="text-lg font-bold text-purple-600">+4.5 kg</p>
              <p className="text-xs text-green-600">↑ Aumento</p>
            </div>
            <div className="p-3 bg-cyan-50 rounded-lg">
              <p className="text-sm text-gray-600">Acqua Totale</p>
              <p className="text-lg font-bold text-cyan-600">+3.2 L</p>
              <p className="text-xs text-green-600">↑ Idratazione</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Massa Cellulare</p>
              <p className="text-lg font-bold text-green-600">+3.4 kg</p>
              <p className="text-xs text-green-600">↑ Crescita</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressCharts;
