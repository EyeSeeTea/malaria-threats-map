import { createPreventionStudy, createPreventionStudyOf } from "../__fixtures__/studyFixtures";
import { DENGUE, MALARIA } from "../__fixtures__/studyValues";
import { belongsToDisease, defaultDisease, getDiseases, getInitialDisease } from "../Disease";

const studiesOf = (diseases: ReadonlyArray<string | null | undefined>) =>
    diseases.map(disease => createPreventionStudyOf(disease));

describe("Disease", () => {
    it("starts with malaria", () => {
        expect(defaultDisease).toBe(MALARIA);
    });

    describe("getDiseases", () => {
        it("returns an empty list when no study carries the field", () => {
            expect(getDiseases([createPreventionStudy(), createPreventionStudy()])).toEqual([]);
        });

        it("returns each disease once, in the order it first appears", () => {
            expect(getDiseases(studiesOf([DENGUE, MALARIA, DENGUE, MALARIA]))).toEqual([DENGUE, MALARIA]);
        });

        it("leaves out empty and missing diseases", () => {
            expect(getDiseases(studiesOf([MALARIA, "", null, undefined]))).toEqual([MALARIA]);
        });
    });

    describe("getInitialDisease", () => {
        it("returns undefined when no study carries the field", () => {
            expect(getInitialDisease([createPreventionStudy()])).toBeUndefined();
        });

        it("returns malaria when it is the only disease", () => {
            expect(getInitialDisease(studiesOf([MALARIA, MALARIA]))).toBe(MALARIA);
        });

        it("returns malaria when the studies carry malaria and another disease, whatever the order", () => {
            expect(getInitialDisease(studiesOf([DENGUE, MALARIA]))).toBe(MALARIA);
        });

        it("returns the first disease when the studies carry no malaria", () => {
            expect(getInitialDisease(studiesOf([DENGUE]))).toBe(DENGUE);
        });

        it("ignores empty values", () => {
            expect(getInitialDisease(studiesOf(["", null, DENGUE]))).toBe(DENGUE);
        });
    });

    describe("belongsToDisease", () => {
        it("keeps no study while no disease is set, with or without the field", () => {
            expect(studiesOf([MALARIA, DENGUE, undefined]).map(study => belongsToDisease(study, undefined))).toEqual([
                false,
                false,
                false,
            ]);
        });

        it("keeps only the studies of the disease, and drops those with an empty or missing field", () => {
            expect(
                studiesOf([MALARIA, DENGUE, "", null, undefined]).map(study => belongsToDisease(study, MALARIA))
            ).toEqual([true, false, false, false, false]);
        });
    });
});
