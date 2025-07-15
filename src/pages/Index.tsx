import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Ruler, Save, TrendingUp, Activity, Calculator, Printer, LogOut, Settings } from "lucide-react";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { calculateBodyComposition, BodyCompositionResults, getBMICategory, getBMICategoryColor, getFatPercentageCategory, getFatPercentageCategoryColor, getEcwIcwRatioStatus } from "@/utils/bodyCompositionCalculator";
import ProgressCharts from "@/components/ProgressCharts";
import ReferenceValues from "@/components/ReferenceValues";
import { useNutritionData, PatientData } from "@/hooks/useNutritionData";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

const Index = () => {
  const { saveNutritionReport, loadPatients, loadProgressData, isLoading } = useNutritionData();
  const { signOut, profile, user } = useAuth();
  
  const [patientData, setPatientData] = useState<PatientData>({
    name: "",
    surname: "",
    phone: "",
    email: "",
    bodyWeight: "", // Peso corporeo
    height: "", // Altezza in cm
    gender: "", // Sesso
    age: "", // Età
    fatPercentage: "", // Percentuale massa grassa
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
    },
    bodyComposition: {
      fat: "",
      ffm: "",
      tbw: "",
      ecw: "",
      icw: "",
      bcm: "",
      ecm: "",
      metabolismoBasale: "",
      bmi: "",
      ecwIcwRatio: "",
      tbwFfmRatio: ""
    }
  });

  const [calculatedResults, setCalculatedResults] = useState<BodyCompositionResults | null>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [realProgressData, setRealProgressData] = useState<any[]>([]);

  // Calcolo automatico quando cambiano peso, altezza, sesso, età e percentuale grassa
  useEffect(() => {
    if (patientData.bodyWeight && patientData.fatPercentage) {
      const bodyWeight = parseFloat(patientData.bodyWeight);
      const fatPercentage = parseFloat(patientData.fatPercentage);
      const height = patientData.height ? parseFloat(patientData.height) : undefined;
      const gender = patientData.gender as 'male' | 'female' | undefined;
      const age = patientData.age ? parseFloat(patientData.age) : undefined;
      
      if (bodyWeight > 0 && fatPercentage >= 0 && fatPercentage <= 100) {
        try {
          const results = calculateBodyComposition({ 
            bodyWeight, 
            fatPercentage, 
            height,
            gender,
            age
          });
          setCalculatedResults(results);
          
          // Aggiorna automaticamente i campi calcolati
          setPatientData(prev => ({
            ...prev,
            bodyComposition: {
              ...prev.bodyComposition,
              fat: fatPercentage.toString(),
              ffm: results.ffm.toString(),
              tbw: results.tbw.toString(),
              ecw: results.ecw.toString(),
              icw: results.icw.toString(),
              bcm: results.bcm.toString(),
              ecm: results.ecm.toString(),
              metabolismoBasale: results.bmr.toString(),
              bmi: results.bmi ? results.bmi.toString() : "",
              ecwIcwRatio: results.ecwIcwRatio ? results.ecwIcwRatio.toString() : "",
              tbwFfmRatio: results.tbwFfmRatio ? results.tbwFfmRatio.toString() : ""
            }
          }));
        } catch (error) {
          console.error('Errore nel calcolo:', error);
          toast.error("Errore nel calcolo dei parametri");
        }
      }
    }
  }, [patientData.bodyWeight, patientData.fatPercentage, patientData.height, patientData.gender, patientData.age]);

  // Carica i pazienti quando si logga
  useEffect(() => {
    if (user) {
      loadPatientsData();
    }
  }, [user]);

  const loadPatientsData = async () => {
    try {
      const patientsData = await loadPatients();
      setPatients(patientsData);
    } catch (error) {
      console.error('Errore nel caricamento pazienti:', error);
    }
  };

  const handlePatientSelect = async (patientId: string) => {
    setSelectedPatientId(patientId);
    const selectedPatient = patients.find(p => p.id === patientId);
    if (selectedPatient) {
      // Carica i dati del paziente selezionato
      setPatientData(prev => ({
        ...prev,
        name: selectedPatient.name,
        surname: selectedPatient.surname,
        phone: selectedPatient.phone || "",
        email: selectedPatient.email || ""
      }));
      
      // Carica i dati di progresso
      try {
        const progressData = await loadProgressData(patientId);
        setRealProgressData(progressData);
        toast.success(`Paziente ${selectedPatient.name} ${selectedPatient.surname} caricato`);
      } catch (error) {
        console.error('Errore nel caricamento progressi:', error);
        setRealProgressData([]);
      }
    }
  };

  // Dati di esempio per il grafico dei progressi con date aggiornate
  const getCurrentDate = () => new Date();
  const getMonthsAgo = (months: number) => {
    const date = new Date();
    date.setMonth(date.getMonth() - months);
    return date.toLocaleDateString('it-IT', { month: 'short', year: 'numeric' });
  };

  const progressData = [
    {
      date: getMonthsAgo(4),
      petto: 95,
      vita: 85,
      fianchi: 98,
      braccio: 32,
      coscia: 58,
      fat: 25.2,
      ffm: 58.3
    },
    {
      date: getMonthsAgo(3),
      petto: 93,
      vita: 83,
      fianchi: 96,
      braccio: 33,
      coscia: 57,
      fat: 24.1,
      ffm: 59.1
    },
    {
      date: getMonthsAgo(2),
      petto: 91,
      vita: 81,
      fianchi: 94,
      braccio: 34,
      coscia: 56,
      fat: 22.8,
      ffm: 60.2
    },
    {
      date: getMonthsAgo(1),
      petto: 89,
      vita: 79,
      fianchi: 92,
      braccio: 35,
      coscia: 55,
      fat: 21.5,
      ffm: 61.5
    },
    {
      date: getMonthsAgo(0),
      petto: 87,
      vita: 77,
      fianchi: 90,
      braccio: 36,
      coscia: 54,
      fat: 20.2,
      ffm: 62.8
    }
  ];

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

  const handleBodyCompositionChange = (parameter: string, value: string) => {
    setPatientData(prev => ({
      ...prev,
      bodyComposition: {
        ...prev.bodyComposition,
        [parameter]: value
      }
    }));
  };

  const handlePrint = () => {
    const printContent = document.getElementById('print-content');
    if (printContent) {
      const printWindow = window.open('', '', 'height=600,width=800');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Report Nutrizionale - ${patientData.name} ${patientData.surname}</title>
              <style>
                body { 
                  font-family: Arial, sans-serif; 
                  margin: 15px; 
                  color: #333;
                  line-height: 1.3;
                  font-size: 12px;
                }
                .header { text-align: center; margin-bottom: 15px; border-bottom: 2px solid #333; padding-bottom: 8px; }
                .two-column { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; }
                .section { margin-bottom: 10px; }
                .section h3 { 
                  color: #2563eb; 
                  font-size: 14px;
                  margin: 0 0 8px 0;
                  border-bottom: 1px solid #e5e7eb; 
                  padding-bottom: 3px; 
                }
                table { 
                  width: 100%; 
                  border-collapse: collapse; 
                  font-size: 11px;
                  margin-bottom: 8px;
                }
                th, td { 
                  border: 1px solid #ddd; 
                  padding: 4px 6px; 
                  text-align: left; 
                }
                th { 
                  background: #f8fafc; 
                  font-weight: bold; 
                  color: #374151;
                }
                .legend { 
                  background: #f0f9ff; 
                  padding: 8px; 
                  border-radius: 4px; 
                  font-size: 10px;
                  margin-top: 10px;
                }
                .legend h4 { margin: 0 0 5px 0; font-size: 11px; color: #2563eb; }
                .normal { color: #059669; font-weight: bold; }
                .warning { color: #d97706; font-weight: bold; }
                .danger { color: #dc2626; font-weight: bold; }
                .progress-charts { margin-top: 15px; page-break-before: always; }
                @media print { 
                  body { margin: 10px; } 
                  .page-break { page-break-before: always; }
                }
              </style>
            </head>
            <body>
              ${printContent.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const handleSave = async () => {
    await saveNutritionReport(patientData);
  };

  const handleLogout = async () => {
    await signOut();
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

  const bodyCompositionFields = [
    { key: "bmi", label: "BMI - Indice Massa Corporea", calculated: true },
    { key: "ffm", label: "FFM - Massa Magra (kg)", calculated: true },
    { key: "tbw", label: "TBW - Acqua Totale (L)", calculated: true },
    { key: "ecw", label: "ECW - Acqua Extracell. (L)", calculated: true },
    { key: "icw", label: "ICW - Acqua Intracell. (L)", calculated: true },
    { key: "bcm", label: "BCM - Massa Cellulare (kg)", calculated: true },
    { key: "ecm", label: "ECM - Massa Extracell. (kg)", calculated: true },
    { key: "metabolismoBasale", label: "Metabolismo Basale (kcal)", calculated: true },
    { key: "ecwIcwRatio", label: "Rapporto ECW/ICW", calculated: true },
    { key: "tbwFfmRatio", label: "Rapporto TBW/FFM", calculated: true }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header con Logo */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-lg overflow-hidden shadow-md">
                <img 
                  src="/lovable-uploads/42f3e8c5-7475-444a-a610-8687200353ab.png" 
                  alt="Dott.ssa Anna Cosentino - Biologa Nutrizionista" 
                  className="w-full h-full object-contain bg-white"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Report Nutrizionale Completo</h1>
                <p className="text-gray-600">Dott.ssa Anna Cosentino - Biologa Nutrizionista</p>
                <p className="text-sm text-gray-500">Sistema professionale per analisi antropometrica e composizione corporea</p>
                {user && (
                  <p className="text-xs text-blue-600 mt-1">
                    Connesso come: {user.email} {profile?.role === 'admin' && '(Admin)'}
                  </p>
                )}
              </div>
            </div>
            <div className="flex space-x-3">
              {!user && (
                <Button asChild variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                  <Link to="/auth">
                    <Settings className="w-4 h-4 mr-2" />
                    Login / Registrati
                  </Link>
                </Button>
              )}
              {user && (
                <Button onClick={handleLogout} variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              )}
              <Button onClick={handlePrint} variant="outline" className="border-gray-300 hover:bg-gray-50">
                <Printer className="w-4 h-4 mr-2" />
                Stampa Report
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Salvando..." : "Salva Report"}
              </Button>
            </div>
          </div>
        </div>

        {/* Selezione Paziente */}
        {user && (
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Selezione Paziente
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="patient-select" className="text-sm font-medium text-gray-700">Seleziona un paziente esistente:</Label>
                  <Select value={selectedPatientId} onValueChange={handlePatientSelect}>
                    <SelectTrigger className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500">
                      <SelectValue placeholder={patients.length === 0 ? "Nessun paziente salvato" : "Scegli paziente..."} />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.name} {patient.surname}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-gray-500">
                  Seleziona un paziente per caricare automaticamente i suoi dati e le misurazioni precedenti.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Colonna Sinistra - Dati Anagrafici */}
          <div className="space-y-6">
            {/* Dati Anagrafici */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Dati Anagrafici
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">Nome *</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Inserisci il nome"
                      value={patientData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
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
                      placeholder="Inserisci il numero"
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

            {/* Calcolo Automatico */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <Calculator className="w-5 h-5 mr-2" />
                  Calcolo Automatico
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bodyWeight" className="text-sm font-medium text-gray-700">Peso Corporeo (kg) *</Label>
                    <Input
                      id="bodyWeight"
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      value={patientData.bodyWeight}
                      onChange={(e) => handleInputChange("bodyWeight", e.target.value)}
                      className="border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height" className="text-sm font-medium text-gray-700">Altezza (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      value={patientData.height}
                      onChange={(e) => handleInputChange("height", e.target.value)}
                      className="border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-sm font-medium text-gray-700">Sesso</Label>
                    <Select value={patientData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                      <SelectTrigger className="border-gray-300 focus:ring-purple-500 focus:border-purple-500">
                        <SelectValue placeholder="Seleziona sesso" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Maschio</SelectItem>
                        <SelectItem value="female">Femmina</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-sm font-medium text-gray-700">Età (anni)</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="0"
                      value={patientData.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      className="border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fatPercentage" className="text-sm font-medium text-gray-700">Massa Grassa (%) *</Label>
                    <Input
                      id="fatPercentage"
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      value={patientData.fatPercentage}
                      onChange={(e) => handleInputChange("fatPercentage", e.target.value)}
                      className="border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  {calculatedResults && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-800 font-medium">✓ Calcoli aggiornati automaticamente</p>
                      {calculatedResults.bmi && (
                        <div className="mt-2 p-2 bg-white rounded border">
                          <p className="text-sm font-medium">BMI: <span className="font-bold">{calculatedResults.bmi}</span></p>
                          <p className={`text-xs ${getBMICategoryColor(calculatedResults.bmi)}`}>
                            {getBMICategory(calculatedResults.bmi)}
                          </p>
                        </div>
                      )}
                      {patientData.gender && patientData.fatPercentage && (
                        <div className="mt-2 p-2 bg-white rounded border">
                          <p className="text-sm font-medium">Massa Grassa: <span className="font-bold">{patientData.fatPercentage}%</span></p>
                          <p className={`text-xs ${getFatPercentageCategoryColor(parseFloat(patientData.fatPercentage), patientData.gender as 'male' | 'female')}`}>
                            {getFatPercentageCategory(parseFloat(patientData.fatPercentage), patientData.gender as 'male' | 'female')}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Misure Antropometriche */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <Ruler className="w-5 h-5 mr-2" />
                  Misure Antropometriche
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 gap-4">
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
              </CardContent>
            </Card>
          </div>

          {/* Colonna Centrale - Composizione Corporea */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Composizione Corporea (Calcolata)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {bodyCompositionFields.map((field) => (
                    <div key={field.key} className="space-y-2">
                      <Label htmlFor={field.key} className="text-sm font-medium text-gray-700 flex items-center">
                        {field.label}
                        {field.calculated && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Auto</span>}
                      </Label>
                      <Input
                        id={field.key}
                        type="number"
                        step="0.1"
                        placeholder="0.0"
                        value={patientData.bodyComposition[field.key as keyof typeof patientData.bodyComposition]}
                        onChange={(e) => handleBodyCompositionChange(field.key, e.target.value)}
                        className="border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                        readOnly={field.calculated}
                        disabled={field.calculated}
                      />
                      {field.key === "bmi" && calculatedResults?.bmi && (
                        <p className={`text-xs mt-1 ${getBMICategoryColor(calculatedResults.bmi)}`}>
                          {getBMICategory(calculatedResults.bmi)}
                        </p>
                      )}
                      {field.key === "ecwIcwRatio" && calculatedResults?.ecwIcwRatio && (
                        <p className={`text-xs mt-1 ${getEcwIcwRatioStatus(calculatedResults.ecwIcwRatio).color}`}>
                          {getEcwIcwRatioStatus(calculatedResults.ecwIcwRatio).status}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                
                <Separator className="my-6" />
                
                <div className="flex justify-center">
                  <Button 
                    onClick={handleSave} 
                    size="lg"
                    className="bg-orange-600 hover:bg-orange-700 px-8"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Salva Composizione
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Riepilogo Parametri Chiave */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-t-lg">
                <CardTitle className="text-sm">Riepilogo Parametri Chiave</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {calculatedResults?.bmi && (
                    <div className="p-3 bg-indigo-50 rounded-lg text-center col-span-2">
                      <p className="text-xs text-gray-600">BMI</p>
                      <p className={`text-lg font-bold ${getBMICategoryColor(calculatedResults.bmi)}`}>
                        {calculatedResults.bmi}
                      </p>
                      <p className={`text-xs ${getBMICategoryColor(calculatedResults.bmi)}`}>
                        {getBMICategory(calculatedResults.bmi)}
                      </p>
                    </div>
                  )}
                  <div className="p-3 bg-red-50 rounded-lg text-center">
                    <p className="text-xs text-gray-600">Massa Grassa</p>
                    <p className="text-lg font-bold text-red-600">
                      {patientData.fatPercentage || "0.0"}%
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg text-center">
                    <p className="text-xs text-gray-600">Massa Magra</p>
                    <p className="text-lg font-bold text-blue-600">
                      {patientData.bodyComposition.ffm || "0.0"} kg
                    </p>
                  </div>
                  <div className="p-3 bg-cyan-50 rounded-lg text-center">
                    <p className="text-xs text-gray-600">Acqua Totale</p>
                    <p className="text-lg font-bold text-cyan-600">
                      {patientData.bodyComposition.tbw || "0.0"} L
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg text-center">
                    <p className="text-xs text-gray-600">Metabolismo</p>
                    <p className="text-lg font-bold text-green-600">
                      {patientData.bodyComposition.metabolismoBasale || "0"} kcal
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Valori di Riferimento */}
            <ReferenceValues gender={patientData.gender as 'male' | 'female'} />
          </div>

          {/* Colonna Destra - Grafici Progressi */}
          <div className="space-y-6">
            <ProgressCharts />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>Report generato dal Sistema Professionale di Analisi Nutrizionale</p>
          <p className="font-medium">Dott.ssa Anna Cosentino - Biologa Nutrizionista</p>
        </div>

        {/* Contenuto di Stampa - Nascosto */}
        <div id="print-content" className="hidden">
          {/* Header */}
          <div className="header">
            <h1>Report Nutrizionale Completo</h1>
            <h2>Dott.ssa Anna Cosentino - Biologa Nutrizionista</h2>
            <p><strong>Paziente:</strong> {patientData.name} {patientData.surname}</p>
            <p><strong>Data:</strong> {new Date().toLocaleDateString('it-IT')}</p>
          </div>

          {/* Dati Principali in Due Colonne */}
          <div className="two-column">
            {/* Colonna Sinistra */}
            <div>
              <div className="section">
                <h3>Dati Anagrafici e Parametri Base</h3>
                <table>
                  <tbody>
                    <tr><td><strong>Nome</strong></td><td>{patientData.name}</td></tr>
                    <tr><td><strong>Cognome</strong></td><td>{patientData.surname}</td></tr>
                    <tr><td><strong>Telefono</strong></td><td>{patientData.phone}</td></tr>
                    <tr><td><strong>Email</strong></td><td>{patientData.email}</td></tr>
                    <tr><td><strong>Peso (kg)</strong></td><td>{patientData.bodyWeight}</td></tr>
                    <tr><td><strong>Altezza (cm)</strong></td><td>{patientData.height}</td></tr>
                    <tr><td><strong>Sesso</strong></td><td>{patientData.gender === 'male' ? 'Maschio' : patientData.gender === 'female' ? 'Femmina' : ''}</td></tr>
                    <tr><td><strong>Età (anni)</strong></td><td>{patientData.age}</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="section">
                <h3>Misure Antropometriche (cm)</h3>
                <table>
                  <tbody>
                    {measurementFields.map((field) => (
                      <tr key={field.key}>
                        <td><strong>{field.label}</strong></td>
                        <td>{patientData.measurements[field.key as keyof typeof patientData.measurements] || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Colonna Destra */}
            <div>
              <div className="section">
                <h3>Composizione Corporea</h3>
                <table>
                  <tbody>
                    <tr><td><strong>Massa Grassa (%)</strong></td><td>{patientData.fatPercentage}</td></tr>
                    {bodyCompositionFields.map((field) => (
                      <tr key={field.key}>
                        <td><strong>{field.label}</strong></td>
                        <td>{patientData.bodyComposition[field.key as keyof typeof patientData.bodyComposition] || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="section">
                <h3>Parametri Chiave</h3>
                <table>
                  <tbody>
                    {calculatedResults?.bmi && (
                      <tr>
                        <td><strong>BMI</strong></td>
                        <td className={getBMICategoryColor(calculatedResults.bmi)}>{calculatedResults.bmi} - {getBMICategory(calculatedResults.bmi)}</td>
                      </tr>
                    )}
                    {patientData.gender && patientData.fatPercentage && (
                      <tr>
                        <td><strong>Categoria Massa Grassa</strong></td>
                        <td className={getFatPercentageCategoryColor(parseFloat(patientData.fatPercentage), patientData.gender as 'male' | 'female')}>
                          {getFatPercentageCategory(parseFloat(patientData.fatPercentage), patientData.gender as 'male' | 'female')}
                        </td>
                      </tr>
                    )}
                    {calculatedResults?.ecwIcwRatio && (
                      <tr>
                        <td><strong>Stato Idratazione</strong></td>
                        <td className={getEcwIcwRatioStatus(calculatedResults.ecwIcwRatio).color}>
                          {getEcwIcwRatioStatus(calculatedResults.ecwIcwRatio).status}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Legenda Valori di Riferimento */}
          <div className="legend">
            <h4>Legenda e Valori di Riferimento</h4>
            <p><strong>BMI:</strong> <span className="normal">18.5-24.9 Normale</span> | <span className="warning">25-29.9 Sovrappeso</span> | <span className="danger">&gt;30 Obeso</span></p>
            <p><strong>Massa Grassa {patientData.gender === 'male' ? 'Maschio' : 'Femmina'}:</strong> 
              {patientData.gender === 'male' ? (
                <span> <span className="normal">6-17% Normale</span> | <span className="warning">18-24% Elevata</span> | <span className="danger">&gt;25% Molto Elevata</span></span>
              ) : (
                <span> <span className="normal">14-24% Normale</span> | <span className="warning">25-31% Elevata</span> | <span className="danger">&gt;32% Molto Elevata</span></span>
              )}
            </p>
            <p><strong>Note:</strong> FFM = Massa Magra, TBW = Acqua Totale, ECW = Acqua Extracellulare, ICW = Acqua Intracellulare, BCM = Massa Cellulare</p>
            <p><strong>Interpretazione:</strong> I valori calcolati utilizzano equazioni validate per l'analisi della composizione corporea. Consultare sempre un professionista qualificato per l'interpretazione completa.</p>
          </div>

          {/* Grafici dei Progressi - Pagina Separata */}
          <div className="progress-charts">
            <h3>Grafici dei Progressi</h3>
            <div style={{width: '100%', height: '400px', marginBottom: '20px'}}>
              <h4>Evoluzione Misure Corporee</h4>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={realProgressData.length > 0 ? realProgressData : progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="petto" stroke="#8884d8" name="Petto" />
                  <Line type="monotone" dataKey="vita" stroke="#82ca9d" name="Vita" />
                  <Line type="monotone" dataKey="fianchi" stroke="#ffc658" name="Fianchi" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div style={{width: '100%', height: '400px'}}>
              <h4>Evoluzione Composizione Corporea</h4>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={realProgressData.length > 0 ? realProgressData : progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="fat" stroke="#ff7300" name="Massa Grassa %" />
                  <Line type="monotone" dataKey="ffm" stroke="#387908" name="Massa Magra kg" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
