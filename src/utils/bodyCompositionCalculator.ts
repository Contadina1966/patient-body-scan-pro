
export interface BodyCompositionInput {
  bodyWeight: number; // BW - Peso corporeo in kg
  fatPercentage: number; // FAT% - Percentuale di massa grassa
  height?: number; // Altezza in cm
  gender?: 'male' | 'female'; // Sesso
}

export interface BodyCompositionResults {
  ffm: number; // FFM - Massa Magra in kg
  tbw: number; // TBW - Acqua Totale in L
  icw: number; // ICW - Acqua Intracellulare in L
  ecw: number; // ECW - Acqua Extracellulare in L
  bcm: number; // BCM - Massa Cellulare in kg
  ecm: number; // ECM - Massa Extracellulare in kg
  bmr: number; // BMR - Metabolismo Basale in kcal
  bmi?: number; // BMI - Indice di Massa Corporea
}

export const calculateBodyComposition = (input: BodyCompositionInput): BodyCompositionResults => {
  const { bodyWeight, fatPercentage, height, gender } = input;
  
  // Validazione input
  if (bodyWeight <= 0 || fatPercentage < 0 || fatPercentage > 100) {
    throw new Error('Valori di input non validi');
  }
  
  // FFM = BW - (BW × FAT%)
  const ffm = bodyWeight - (bodyWeight * (fatPercentage / 100));
  
  // TBW = 0,73 × FFM (stima empirica)
  const tbw = 0.73 * ffm;
  
  // ICW = 0,60 × TBW
  const icw = 0.60 * tbw;
  
  // ECW = 0,40 × TBW
  const ecw = 0.40 * tbw;
  
  // BCM = 0,70 × FFM
  const bcm = 0.70 * ffm;
  
  // ECM = FFM - BCM
  const ecm = ffm - bcm;
  
  // BMR = 370 + (21,6 × FFM)
  const bmr = 370 + (21.6 * ffm);
  
  // BMI = peso (kg) / altezza (m)²
  let bmi: number | undefined;
  if (height && height > 0) {
    const heightInMeters = height / 100;
    bmi = bodyWeight / (heightInMeters * heightInMeters);
  }
  
  const results: BodyCompositionResults = {
    ffm: Math.round(ffm * 10) / 10,
    tbw: Math.round(tbw * 10) / 10,
    icw: Math.round(icw * 10) / 10,
    ecw: Math.round(ecw * 10) / 10,
    bcm: Math.round(bcm * 10) / 10,
    ecm: Math.round(ecm * 10) / 10,
    bmr: Math.round(bmr)
  };
  
  if (bmi !== undefined) {
    results.bmi = Math.round(bmi * 10) / 10;
  }
  
  return results;
};

export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return "Sottopeso";
  if (bmi < 25) return "Normopeso"; 
  if (bmi < 30) return "Sovrappeso";
  return "Obesità";
};

export const getBMICategoryColor = (bmi: number): string => {
  if (bmi < 18.5) return "text-blue-600";
  if (bmi < 25) return "text-green-600";
  if (bmi < 30) return "text-yellow-600";
  return "text-red-600";
};
