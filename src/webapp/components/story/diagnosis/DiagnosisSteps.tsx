import DiagnosisEnglishSteps from "./english/DiagnosisEnglishSteps";
import DiagnosisSpanishSteps from "./spanish/DiagnosisSpanishSteps";
import DiagnosisFrenchSteps from "./french/DiagnosisFrenchSteps";

const diagnosisSteps = {
    en: DiagnosisEnglishSteps,
    es: DiagnosisSpanishSteps,
    fr: DiagnosisFrenchSteps,
};

export default diagnosisSteps;
