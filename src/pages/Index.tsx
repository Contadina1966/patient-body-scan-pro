
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, Ruler, Save } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [patientData, setPatientData] = useState({
    name: "",
    surname: "",
    phone: "",
    email: "",
    measurements: {
      braccio: "",
      polso: "",
      petto: "",
      spalle: "",
      vita: "",
      fianchi: "",
      radCoscia: "",
      medCoscia: "",
      ginocchio: "",
      caviglia: ""
    }
  });

  const handleInputChange = (field: string, value: string) => {
    setPatientData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMeasurementChange = (measurement: string, value: string) => {
    setPatientData(prev => ({
      ...prev,
      measurements: {
        ...prev.measurements,
        [measurement]: value
      }
    }));
  };

  const handleSave = () => {
    // Validazione base
    if (!patientData.name || !patientData.surname) {
      toast.error("Nome e cognome sono obbligatori");
      return;
    }
    
    console.log("Dati paziente salvati:", patientData);
    toast.success("Dati paziente salvati con successo!");
  };

  const measurementFields = [
    { key: "braccio", label: "Braccio (cm)" },
    { key: "polso", label: "Polso (cm)" },
    { key: "petto", label: "Petto (cm)" },
    { key: "spalle", label: "Spalle (cm)" },
    { key: "vita", label: "Vita (cm)" },
    { key: "fianchi", label: "Fianchi (cm)" },
    { key: "radCoscia", label: "Rad. Coscia (cm)" },
    { key: "medCoscia", label: "Med. Coscia (cm)" },
    { key: "ginocchio", label: "Ginocchio (cm)" },
    { key: "caviglia", label: "Caviglia (cm)" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header con Logo */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Placeholder per il logo - sostituire con il logo reale */}
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Ruler className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Sistema Misure Paziente</h1>
                <p className="text-gray-600">Gestione professionale delle misurazioni</p>
              </div>
            </div>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Salva Dati
            </Button>
          </div>
        </div>

        {/* Dati Anagrafici */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Dati Anagrafici
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">Nome *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Inserisci il nome"
                  value={patientData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="surname" className="text-sm font-medium text-gray-700">Cognome *</Label>
                <Input
                  id="surname"
                  type="text"
                  placeholder="Inserisci il cognome"
                  value={patientData.surname}
                  onChange={(e) => handleInputChange("surname", e.target.value)}
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Telefono</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Inserisci il numero di telefono"
                  value={patientData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Inserisci l'email"
                  value={patientData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sezione Misure */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center">
              <Ruler className="w-5 h-5 mr-2" />
              Misure Corporee
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {measurementFields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={field.key} className="text-sm font-medium text-gray-700">
                    {field.label}
                  </Label>
                  <Input
                    id={field.key}
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                    value={patientData.measurements[field.key as keyof typeof patientData.measurements]}
                    onChange={(e) => handleMeasurementChange(field.key, e.target.value)}
                    className="border-gray-300 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              ))}
            </div>
            
            <Separator className="my-6" />
            
            <div className="flex justify-center">
              <Button 
                onClick={handleSave} 
                size="lg"
                className="bg-green-600 hover:bg-green-700 px-8"
              >
                <Save className="w-4 h-4 mr-2" />
                Salva Tutte le Misure
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          Sistema professionale per la gestione delle misure dei pazienti
        </div>
      </div>
    </div>
  );
};

export default Index;
