import { createPreventionStudy } from "../__fixtures__/studyFixtures";
import { CARBAMATES, DENGUE, MALARIA, ORGANOPHOSPHATES, PYRETHROIDS } from "../__fixtures__/studyValues";
import {
    belongsToDisease,
    checksOptionsOnMapChange,
    defaultDisease,
    getDiseases,
    getInitialDisease,
    invitesAnophelesReports,
    isDiseaseSwitch,
    pickOption,
} from "../Disease";

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

    describe("belongsToDisease", () => {
        it("keeps no study while no disease is set, with or without the field", () => {
            expect(studiesOf([MALARIA, DENGUE, undefined]).map(study => belongsToDisease(undefined, study))).toEqual([
                false,
                false,
                false,
            ]);
        });

        it("keeps only the studies of the disease, and drops those with an empty or missing field", () => {
            expect(
                studiesOf([MALARIA, DENGUE, "", null, undefined]).map(study => belongsToDisease(MALARIA, study))
            ).toEqual([true, false, false, false, false]);
        });
    });

    describe("isDiseaseSwitch", () => {
        it("is a switch from one disease to another", () => {
            expect(isDiseaseSwitch(MALARIA, DENGUE)).toBe(true);
        });

        it("is not a switch when the disease is set for the first time", () => {
            expect(isDiseaseSwitch(undefined, MALARIA)).toBe(false);
        });

        it("is not a switch when the disease is unset", () => {
            expect(isDiseaseSwitch(DENGUE, undefined)).toBe(false);
        });

        it("is not a switch when the disease stays the same", () => {
            expect(isDiseaseSwitch(DENGUE, DENGUE)).toBe(false);
        });
    });

    describe("checksOptionsOnMapChange", () => {
        it("does not check while no disease is set, as the map does today", () => {
            expect(checksOptionsOnMapChange(undefined)).toBe(false);
        });

        it("does not check for malaria", () => {
            expect(checksOptionsOnMapChange(MALARIA)).toBe(false);
        });

        it("checks for another disease", () => {
            expect(checksOptionsOnMapChange(DENGUE)).toBe(true);
        });
    });

    describe("pickOption", () => {
        it("keeps the current value when it is offered", () => {
            expect(pickOption([CARBAMATES, ORGANOPHOSPHATES, PYRETHROIDS], PYRETHROIDS, ORGANOPHOSPHATES)).toBe(
                ORGANOPHOSPHATES
            );
        });

        it("takes the preferred value when the current one is not offered", () => {
            expect(pickOption([CARBAMATES, PYRETHROIDS], PYRETHROIDS, ORGANOPHOSPHATES)).toBe(PYRETHROIDS);
        });

        it("takes the preferred value when there is no current value", () => {
            expect(pickOption([CARBAMATES, PYRETHROIDS], PYRETHROIDS)).toBe(PYRETHROIDS);
        });

        it("takes the first option when neither the current nor the preferred value is offered", () => {
            expect(pickOption([CARBAMATES, ORGANOPHOSPHATES], PYRETHROIDS)).toBe(CARBAMATES);
        });

        it("keeps the current value when nothing is offered, because the studies are not loaded yet", () => {
            expect(pickOption([], PYRETHROIDS, ORGANOPHOSPHATES)).toBe(ORGANOPHOSPHATES);
        });

        it("takes the preferred value when nothing is offered and there is no current value", () => {
            expect(pickOption([], PYRETHROIDS)).toBe(PYRETHROIDS);
        });
    });
});
