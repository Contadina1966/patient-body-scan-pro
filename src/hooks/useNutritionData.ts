import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PatientData {
  name: string;
  surname: string;
  phone: string;
  email: string;
  bodyWeight: string;
  height: string;
  gender: string;
  age: string;
  fatPercentage: string;
  measurements: {
    braccio: string;
    polso: string;
    petto: string;
    spalle: string;
    vita: string;
    fianchi: string;
    radCoscia: string;
    medCoscia: string;
    ginocchio: string;
    caviglia: string;
  };
  bodyComposition: {
    fat: string;
    ffm: string;
    tbw: string;
    ecw: string;
    icw: string;
    bcm: string;
    ecm: string;
    metabolismoBasale: string;
    bmi: string;
    ecwIcwRatio: string;
    tbwFfmRatio: string;
  };
}

export const useNutritionData = () => {
  const [isLoading, setIsLoading] = useState(false);

  const saveNutritionReport = async (patientData: PatientData) => {
    setIsLoading(true);
    
    try {
      // Verifica autenticazione
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Devi essere autenticato per salvare i dati');
        return false;
      }

      // Validazione base
      if (!patientData.name || !patientData.surname) {
        toast.error('Nome e cognome sono obbligatori');
        return false;
      }

      // 1. Salva o aggiorna il paziente
      const { data: existingPatient, error: searchError } = await supabase
        .from('patients')
        .select('id')
        .eq('user_id', user.id)
        .eq('name', patientData.name)
        .eq('surname', patientData.surname)
        .maybeSingle();

      if (searchError) {
        console.error('Errore ricerca paziente:', searchError);
        toast.error('Errore nella ricerca del paziente');
        return false;
      }

      let patientId: string;

      if (existingPatient) {
        // Aggiorna paziente esistente
        const { error: updateError } = await supabase
          .from('patients')
          .update({
            phone: patientData.phone || null,
            email: patientData.email || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingPatient.id);

        if (updateError) {
          console.error('Errore aggiornamento paziente:', updateError);
          toast.error('Errore nell\'aggiornamento del paziente');
          return false;
        }

        patientId = existingPatient.id;
      } else {
        // Crea nuovo paziente
        const { data: newPatient, error: insertError } = await supabase
          .from('patients')
          .insert({
            user_id: user.id,
            name: patientData.name,
            surname: patientData.surname,
            phone: patientData.phone || null,
            email: patientData.email || null
          })
          .select('id')
          .single();

        if (insertError) {
          console.error('Errore creazione paziente:', insertError);
          toast.error('Errore nella creazione del paziente');
          return false;
        }

        patientId = newPatient.id;
      }

      // 2. Salva il report nutrizionale
      const { data: report, error: reportError } = await supabase
        .from('nutrition_reports')
        .insert({
          patient_id: patientId,
          user_id: user.id,
          body_weight: patientData.bodyWeight ? parseFloat(patientData.bodyWeight) : null,
          height: patientData.height ? parseFloat(patientData.height) : null,
          gender: patientData.gender || null,
          age: patientData.age ? parseInt(patientData.age) : null,
          fat_percentage: patientData.fatPercentage ? parseFloat(patientData.fatPercentage) : null,
          ffm: patientData.bodyComposition.ffm ? parseFloat(patientData.bodyComposition.ffm) : null,
          tbw: patientData.bodyComposition.tbw ? parseFloat(patientData.bodyComposition.tbw) : null,
          ecw: patientData.bodyComposition.ecw ? parseFloat(patientData.bodyComposition.ecw) : null,
          icw: patientData.bodyComposition.icw ? parseFloat(patientData.bodyComposition.icw) : null,
          bcm: patientData.bodyComposition.bcm ? parseFloat(patientData.bodyComposition.bcm) : null,
          ecm: patientData.bodyComposition.ecm ? parseFloat(patientData.bodyComposition.ecm) : null,
          bmr: patientData.bodyComposition.metabolismoBasale ? parseInt(patientData.bodyComposition.metabolismoBasale) : null,
          bmi: patientData.bodyComposition.bmi ? parseFloat(patientData.bodyComposition.bmi) : null,
          ecw_icw_ratio: patientData.bodyComposition.ecwIcwRatio ? parseFloat(patientData.bodyComposition.ecwIcwRatio) : null,
          tbw_ffm_ratio: patientData.bodyComposition.tbwFfmRatio ? parseFloat(patientData.bodyComposition.tbwFfmRatio) : null
        })
        .select('id')
        .single();

      if (reportError) {
        console.error('Errore salvataggio report:', reportError);
        toast.error('Errore nel salvataggio del report');
        return false;
      }

      // 3. Salva le misure antropometriche
      const { error: measurementsError } = await supabase
        .from('anthropometric_measurements')
        .insert({
          report_id: report.id,
          user_id: user.id,
          braccio: patientData.measurements.braccio ? parseFloat(patientData.measurements.braccio) : null,
          polso: patientData.measurements.polso ? parseFloat(patientData.measurements.polso) : null,
          petto: patientData.measurements.petto ? parseFloat(patientData.measurements.petto) : null,
          spalle: patientData.measurements.spalle ? parseFloat(patientData.measurements.spalle) : null,
          vita: patientData.measurements.vita ? parseFloat(patientData.measurements.vita) : null,
          fianchi: patientData.measurements.fianchi ? parseFloat(patientData.measurements.fianchi) : null,
          rad_coscia: patientData.measurements.radCoscia ? parseFloat(patientData.measurements.radCoscia) : null,
          med_coscia: patientData.measurements.medCoscia ? parseFloat(patientData.measurements.medCoscia) : null,
          ginocchio: patientData.measurements.ginocchio ? parseFloat(patientData.measurements.ginocchio) : null,
          caviglia: patientData.measurements.caviglia ? parseFloat(patientData.measurements.caviglia) : null
        });

      if (measurementsError) {
        console.error('Errore salvataggio misure:', measurementsError);
        toast.error('Errore nel salvataggio delle misure');
        return false;
      }

      // 4. Salva i dati per il tracking progressi
      const { error: progressError } = await supabase
        .from('progress_tracking')
        .insert({
          patient_id: patientId,
          user_id: user.id,
          measurement_date: new Date().toISOString().split('T')[0],
          body_weight: patientData.bodyWeight ? parseFloat(patientData.bodyWeight) : null,
          fat_percentage: patientData.fatPercentage ? parseFloat(patientData.fatPercentage) : null,
          ffm: patientData.bodyComposition.ffm ? parseFloat(patientData.bodyComposition.ffm) : null,
          tbw: patientData.bodyComposition.tbw ? parseFloat(patientData.bodyComposition.tbw) : null,
          bcm: patientData.bodyComposition.bcm ? parseFloat(patientData.bodyComposition.bcm) : null,
          bmr: patientData.bodyComposition.metabolismoBasale ? parseInt(patientData.bodyComposition.metabolismoBasale) : null,
          petto: patientData.measurements.petto ? parseFloat(patientData.measurements.petto) : null,
          vita: patientData.measurements.vita ? parseFloat(patientData.measurements.vita) : null,
          fianchi: patientData.measurements.fianchi ? parseFloat(patientData.measurements.fianchi) : null,
          braccio: patientData.measurements.braccio ? parseFloat(patientData.measurements.braccio) : null,
          rad_coscia: patientData.measurements.radCoscia ? parseFloat(patientData.measurements.radCoscia) : null
        });

      if (progressError) {
        console.error('Errore salvataggio progresso:', progressError);
        toast.error('Errore nel salvataggio del progresso');
        return false;
      }

      toast.success('Report nutrizionale salvato con successo nel database!');
      return true;

    } catch (error) {
      console.error('Errore generale salvataggio:', error);
      toast.error('Errore imprevisto nel salvataggio');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loadPatients = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return [];
      }

      const { data: patients, error } = await supabase
        .from('patients')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Errore caricamento pazienti:', error);
        toast.error('Errore nel caricamento dei pazienti');
        return [];
      }

      return patients || [];
    } catch (error) {
      console.error('Errore generale caricamento pazienti:', error);
      return [];
    }
  };

  const loadProgressData = async (patientId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return [];
      }

      const { data: progress, error } = await supabase
        .from('progress_tracking')
        .select('*')
        .eq('patient_id', patientId)
        .eq('user_id', user.id)
        .order('measurement_date', { ascending: true });

      if (error) {
        console.error('Errore caricamento progressi:', error);
        return [];
      }

      return progress || [];
    } catch (error) {
      console.error('Errore generale caricamento progressi:', error);
      return [];
    }
  };

  return {
    saveNutritionReport,
    loadPatients,
    loadProgressData,
    isLoading
  };
};