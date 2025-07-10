
export interface BodyCompositionInput {
  bodyWeight: number; // BW - Peso corporeo in kg
  fatPercentage: number; // FAT% - Percentuale di massa grassa
  height?: number; // Altezza in cm
  gender?: 'male' | 'female'; // Sesso
  age?: number; // Età in anni
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
  ecwIcwRatio?: number; // Rapporto ECW/ICW
  tbwFfmRatio?: number; // Rapporto TBW/FFM
}

export interface ReferenceValues {
  fatPercentage: {
    male: { low: number; normal: [number, number]; high: number };
    female: { low: number; normal: [number, number]; high: number };
  };
  tbwFfmRatio: {
    normal: [number, number];
  };
  ecwIcwRatio: {
    normal: [number, number];
  };
  visceralFat: {
    normal: [number, number];
    high: number;
  };
}

export const referenceValues: ReferenceValues = {
  fatPercentage: {
    male: { low: 10, normal: [10, 20], high: 25 },
    female: { low: 16, normal: [16, 30], high: 35 }
  },
  tbwFfmRatio: {
    normal: [0.70, 0.75]
  },
  ecwIcwRatio: {
    normal: [0.60, 0.70]
  },
  visceralFat: {
    normal: [1, 9],
    high: 10
  }
};

export const calculateBodyComposition = (input: BodyCompositionInput): BodyCompositionResults => {
  const { bodyWeight, fatPercentage, height, gender, age } = input;
  
  // Validazione input
  if (bodyWeight <= 0 || fatPercentage < 0 || fatPercentage > 100) {
    throw new Error('Valori di input non validi');
  }
  
  // FFM = BW - (BW × FAT%)
  const ffm = bodyWeight - (bodyWeight * (fatPercentage / 100));
  
  // TBW con formula più accurata basata su sesso ed età
  let tbw: number;
  if (gender === 'male') {
    tbw = 0.74 * ffm; // Maschi: circa 74% della FFM
  } else if (gender === 'female') {
    tbw = 0.72 * ffm; // Femmine: circa 72% della FFM
  } else {
    tbw = 0.73 * ffm; // Valore medio se sesso non specificato
  }
  
  // ICW = circa 60% del TBW (valore più preciso dall'impedenziometro)
  const icw = 0.60 * tbw;
  
  // ECW = TBW - ICW
  const ecw = tbw - icw;
  
  // BCM (Body Cell Mass) - formula più accurata
  const bcm = 0.75 * ffm;
  
  // ECM = FFM - BCM
  const ecm = ffm - bcm;
  
  // BMR con formula di Cunningham per FFM
  const bmr = 500 + (22 * ffm);
  
  // BMI = peso (kg) / altezza (m)²
  let bmi: number | undefined;
  if (height && height > 0) {
    const heightInMeters = height / 100;
    bmi = bodyWeight / (heightInMeters * heightInMeters);
  }
  
  // Rapporti diagnostici
  const ecwIcwRatio = ecw / icw;
  const tbwFfmRatio = tbw / ffm;
  
  const results: BodyCompositionResults = {
    ffm: Math.round(ffm * 10) / 10,
    tbw: Math.round(tbw * 10) / 10,
    icw: Math.round(icw * 10) / 10,
    ecw: Math.round(ecw * 10) / 10,
    bcm: Math.round(bcm * 10) / 10,
    ecm: Math.round(ecm * 10) / 10,
    bmr: Math.round(bmr),
    ecwIcwRatio: Math.round(ecwIcwRatio * 100) / 100,
    tbwFfmRatio: Math.round(tbwFfmRatio * 100) / 100
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

export const getFatPercentageCategory = (fatPercentage: number, gender: 'male' | 'female'): string => {
  const ref = referenceValues.fatPercentage[gender];
  if (fatPercentage < ref.low) return "Molto Basso";
  if (fatPercentage >= ref.normal[0] && fatPercentage <= ref.normal[1]) return "Normale";
  if (fatPercentage > ref.high) return "Molto Alto";
  return "Alto";
};

export const getFatPercentageCategoryColor = (fatPercentage: number, gender: 'male' | 'female'): string => {
  const ref = referenceValues.fatPercentage[gender];
  if (fatPercentage < ref.low) return "text-blue-600";
  if (fatPercentage >= ref.normal[0] && fatPercentage <= ref.normal[1]) return "text-green-600";
  if (fatPercentage > ref.high) return "text-red-600";
  return "text-yellow-600";
};

export const getEcwIcwRatioStatus = (ratio: number): { status: string; color: string } => {
  const ref = referenceValues.ecwIcwRatio;
  if (ratio >= ref.normal[0] && ratio <= ref.normal[1]) {
    return { status: "Normale", color: "text-green-600" };
  } else if (ratio > ref.normal[1]) {
    return { status: "Elevato", color: "text-red-600" };
  } else {
    return { status: "Basso", color: "text-blue-600" };
  }
};
