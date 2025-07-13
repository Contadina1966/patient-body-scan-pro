-- Creazione tabelle per il sistema nutrizionale

-- Tabella principale pazienti
CREATE TABLE public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  surname TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabella report nutrizionali
CREATE TABLE public.nutrition_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Dati di base
  body_weight DECIMAL(5,2),
  height DECIMAL(5,2),
  gender TEXT CHECK (gender IN ('male', 'female')),
  age INTEGER,
  fat_percentage DECIMAL(5,2),
  
  -- Composizione corporea calcolata
  ffm DECIMAL(5,2), -- Massa Magra
  tbw DECIMAL(5,2), -- Acqua Totale
  ecw DECIMAL(5,2), -- Acqua Extracellulare
  icw DECIMAL(5,2), -- Acqua Intracellulare
  bcm DECIMAL(5,2), -- Massa Cellulare
  ecm DECIMAL(5,2), -- Massa Extracellulare
  bmr INTEGER, -- Metabolismo Basale
  bmi DECIMAL(5,2), -- BMI
  ecw_icw_ratio DECIMAL(5,3), -- Rapporto ECW/ICW
  tbw_ffm_ratio DECIMAL(5,3), -- Rapporto TBW/FFM
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabella misure antropometriche
CREATE TABLE public.anthropometric_measurements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID REFERENCES public.nutrition_reports(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Misure antropometriche
  braccio DECIMAL(5,2),
  polso DECIMAL(5,2),
  petto DECIMAL(5,2),
  spalle DECIMAL(5,2),
  vita DECIMAL(5,2),
  fianchi DECIMAL(5,2),
  rad_coscia DECIMAL(5,2),
  med_coscia DECIMAL(5,2),
  ginocchio DECIMAL(5,2),
  caviglia DECIMAL(5,2),
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabella progressi nel tempo
CREATE TABLE public.progress_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Data del rilevamento
  measurement_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Dati corporei
  body_weight DECIMAL(5,2),
  fat_percentage DECIMAL(5,2),
  ffm DECIMAL(5,2),
  tbw DECIMAL(5,2),
  bcm DECIMAL(5,2),
  bmr INTEGER,
  
  -- Misure principali
  petto DECIMAL(5,2),
  vita DECIMAL(5,2),
  fianchi DECIMAL(5,2),
  braccio DECIMAL(5,2),
  rad_coscia DECIMAL(5,2),
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Abilita Row Level Security
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutrition_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anthropometric_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_tracking ENABLE ROW LEVEL SECURITY;

-- Policies per patients
CREATE POLICY "Users can view their own patients" 
ON public.patients 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own patients" 
ON public.patients 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own patients" 
ON public.patients 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own patients" 
ON public.patients 
FOR DELETE 
USING (auth.uid() = user_id);

-- Policies per nutrition_reports
CREATE POLICY "Users can view their own reports" 
ON public.nutrition_reports 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reports" 
ON public.nutrition_reports 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reports" 
ON public.nutrition_reports 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reports" 
ON public.nutrition_reports 
FOR DELETE 
USING (auth.uid() = user_id);

-- Policies per anthropometric_measurements
CREATE POLICY "Users can view their own measurements" 
ON public.anthropometric_measurements 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own measurements" 
ON public.anthropometric_measurements 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own measurements" 
ON public.anthropometric_measurements 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own measurements" 
ON public.anthropometric_measurements 
FOR DELETE 
USING (auth.uid() = user_id);

-- Policies per progress_tracking
CREATE POLICY "Users can view their own progress" 
ON public.progress_tracking 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own progress" 
ON public.progress_tracking 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
ON public.progress_tracking 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress" 
ON public.progress_tracking 
FOR DELETE 
USING (auth.uid() = user_id);

-- Funzione per aggiornare timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger per aggiornamento automatico timestamp
CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON public.patients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_nutrition_reports_updated_at
  BEFORE UPDATE ON public.nutrition_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Indici per migliorare le performance
CREATE INDEX idx_patients_user_id ON public.patients(user_id);
CREATE INDEX idx_nutrition_reports_patient_id ON public.nutrition_reports(patient_id);
CREATE INDEX idx_nutrition_reports_user_id ON public.nutrition_reports(user_id);
CREATE INDEX idx_anthropometric_measurements_report_id ON public.anthropometric_measurements(report_id);
CREATE INDEX idx_progress_tracking_patient_id ON public.progress_tracking(patient_id);
CREATE INDEX idx_progress_tracking_measurement_date ON public.progress_tracking(measurement_date);