import PreventionEnglishSteps from "./english/PreventionEnglishSteps";
import PreventionSpanishSteps from "./spanish/PreventionSpanishSteps";
import PreventionFrenchSteps from "./french/PreventionFrenchSteps";

const preventionSteps = {
    en: PreventionEnglishSteps,
    es: PreventionSpanishSteps,
    fr: PreventionFrenchSteps,
};
export default preventionSteps;
