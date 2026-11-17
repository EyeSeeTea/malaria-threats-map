import { DENGUE, MALARIA } from "../../../domain/entities/__fixtures__/studyValues";
import { DIAGNOSIS_THEME, INVASIVE_THEME, PREVENTION_THEME, TREATMENT_THEME } from "../__fixtures__/filtersFixtures";
import { getThemeDisease, replacesValuesNotOfferedOnMap } from "../diseaseMapBehaviour";

// keepsMapBehaviourBeforeDisease is pinned through showsAnophelesReportLink in VectorOccuranceFilters.spec.

describe("diseaseMapBehaviour", () => {
    describe("getThemeDisease", () => {
        const vectorDiseases = { prevention: DENGUE, invasive: MALARIA };

        it("is the disease filter of the theme on prevention and invasive", () => {
            expect([PREVENTION_THEME, INVASIVE_THEME].map(theme => getThemeDisease(theme, vectorDiseases))).toEqual([
                DENGUE,
                MALARIA,
            ]);
        });

        it("is malaria on diagnosis and treatment, whatever the vector themes have chosen", () => {
            const dengueOnVectorThemes = { prevention: DENGUE, invasive: DENGUE };

            expect(
                [DIAGNOSIS_THEME, TREATMENT_THEME].map(theme => getThemeDisease(theme, dengueOnVectorThemes))
            ).toEqual([MALARIA, MALARIA]);
        });
    });

    describe("replacesValuesNotOfferedOnMap", () => {
        it("replaces them on the map with a disease other than the default one", () => {
            expect(replacesValuesNotOfferedOnMap("map", DENGUE)).toBe(true);
        });

        it("keeps today's behaviour on the map with malaria and while no disease is set", () => {
            expect([MALARIA, undefined].map(disease => replacesValuesNotOfferedOnMap("map", disease))).toEqual([
                false,
                false,
            ]);
        });

        it("keeps today's behaviour on Data Download, whatever the disease of the map", () => {
            expect(replacesValuesNotOfferedOnMap("download", DENGUE)).toBe(false);
        });
    });
});
