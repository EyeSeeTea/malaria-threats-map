import PreventionEnglishSteps from "./english/PBOEnglishSteps";
import PreventionSpanishSteps from "./spanish/PBOSpanishSteps";
import PreventionFrenchSteps from "./french/PBOFrenchSteps";

const pboSteps = {
    en: PreventionEnglishSteps,
    es: PreventionSpanishSteps,
    fr: PreventionFrenchSteps,
};
export default pboSteps;
