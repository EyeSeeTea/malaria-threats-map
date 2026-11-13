import i18next from "i18next";
import { createPreventionStudy } from "../../../../domain/entities/__fixtures__/studyFixtures";
import { DENGUE, MALARIA } from "../../../../domain/entities/__fixtures__/studyValues";
import { getDiseaseFilterOptions } from "../DiseaseFilter";

const MALARIA_LABEL = "Malaria (xMART)";

const xmartTranslations = { [`DISEASE.${MALARIA}`]: MALARIA_LABEL };

const studiesOf = (diseases: ReadonlyArray<string | undefined>) =>
    diseases.map(DISEASE => createPreventionStudy({ DISEASE }));

beforeAll(() => {
    i18next.addResourceBundle("en", "translation", xmartTranslations);
});

afterAll(() => {
    i18next.removeResourceBundle("en", "translation");
});

describe("getDiseaseFilterOptions", () => {
    it("offers nothing when no study carries a disease, so the filter renders nothing", () => {
        expect(getDiseaseFilterOptions(studiesOf([undefined, undefined]))).toEqual([]);
    });

    it("offers the only disease the studies carry, as the only option", () => {
        expect(getDiseaseFilterOptions(studiesOf([MALARIA, MALARIA, undefined]))).toEqual([
            { value: MALARIA, label: MALARIA_LABEL },
        ]);
    });

    it("offers every disease once, in the order they first appear, labelled with its code when it has no label", () => {
        expect(getDiseaseFilterOptions(studiesOf([DENGUE, MALARIA, DENGUE]))).toEqual([
            { value: DENGUE, label: DENGUE },
            { value: MALARIA, label: MALARIA_LABEL },
        ]);
    });
});
