import TreatmentEnglishSteps from "./english/TreatmentEnglishSteps";
import TreatmentSpanishSteps from "./spanish/TreatmentSpanishSteps";
import TreatmentFrenchSteps from "./french/TreatmentFrenchSteps";

const treatmentSteps = {
    en: TreatmentEnglishSteps,
    es: TreatmentSpanishSteps,
    fr: TreatmentFrenchSteps,
};

export default treatmentSteps;
