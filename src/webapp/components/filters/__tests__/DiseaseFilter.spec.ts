import { createPreventionStudyOf } from "../../../../domain/entities/__fixtures__/studyFixtures";
import { DENGUE, MALARIA } from "../../../../domain/entities/__fixtures__/studyValues";
import { addXmartLabels, removeEnglishResources } from "../../../types/__fixtures__/translationFixtures";
import { getDiseaseFilterOptions } from "../DiseaseFilter";

const MALARIA_LABEL = "Malaria (xMART)";

const studiesOf = (diseases: ReadonlyArray<string | undefined>) =>
    diseases.map(disease => createPreventionStudyOf(disease));

describe("getDiseaseFilterOptions", () => {
    beforeAll(() => {
        addXmartLabels({ [`DISEASE.${MALARIA}`]: MALARIA_LABEL });
    });

    afterAll(() => {
        removeEnglishResources();
    });

    it("offers nothing when no study carries a disease, so the filter renders nothing", () => {
        expect(getDiseaseFilterOptions(studiesOf([undefined, undefined]))).toEqual([]);
    });

    it("offers the only disease the studies carry, as the only option", () => {
        expect(getDiseaseFilterOptions(studiesOf([MALARIA, MALARIA, undefined]))).toEqual([
            { value: MALARIA, label: MALARIA_LABEL },
        ]);
    });

    // getInitialDisease selects it: with no malaria in the data the filter shows Dengue, selected.
    it("offers Dengue as the only option when the studies carry no malaria", () => {
        expect(getDiseaseFilterOptions(studiesOf([DENGUE, DENGUE]))).toEqual([{ value: DENGUE, label: DENGUE }]);
    });

    it("offers every disease once, in the order they first appear, labelled with its code when it has no label", () => {
        expect(getDiseaseFilterOptions(studiesOf([DENGUE, MALARIA, DENGUE]))).toEqual([
            { value: DENGUE, label: DENGUE },
            { value: MALARIA, label: MALARIA_LABEL },
        ]);
    });
});
