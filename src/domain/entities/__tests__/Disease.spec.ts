import { createPreventionStudy } from "../__fixtures__/studyFixtures";
import { DENGUE, MALARIA, ORGANOPHOSPHATES, PYRETHROIDS } from "../__fixtures__/studyValues";
import { defaultDisease, getDiseases, getInitialDisease, invitesAnophelesReports, keepIfOffered } from "../Disease";

const studiesOf = (diseases: ReadonlyArray<string | null | undefined>) =>
    diseases.map(DISEASE => createPreventionStudy({ DISEASE }));

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

        it("returns an empty list for no studies", () => {
            expect(getDiseases([])).toEqual([]);
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

    describe("invitesAnophelesReports", () => {
        it("invites while no disease is set, as the map does today", () => {
            expect(invitesAnophelesReports(undefined)).toBe(true);
        });

        it("invites for malaria", () => {
            expect(invitesAnophelesReports(MALARIA)).toBe(true);
        });

        it("does not invite for another disease", () => {
            expect(invitesAnophelesReports(DENGUE)).toBe(false);
        });
    });

    describe("keepIfOffered", () => {
        it("keeps the current value when the new disease offers it", () => {
            expect(keepIfOffered(PYRETHROIDS, [ORGANOPHOSPHATES, PYRETHROIDS])).toBe(PYRETHROIDS);
        });

        it("takes the first value offered when the new disease does not offer the current one", () => {
            expect(keepIfOffered(PYRETHROIDS, [ORGANOPHOSPHATES])).toBe(ORGANOPHOSPHATES);
        });

        it("takes the first value offered when there is no current value", () => {
            expect(keepIfOffered(undefined, [ORGANOPHOSPHATES, PYRETHROIDS])).toBe(ORGANOPHOSPHATES);
        });

        it("returns undefined when the new disease offers nothing", () => {
            expect(keepIfOffered(PYRETHROIDS, [])).toBeUndefined();
        });
    });
});
