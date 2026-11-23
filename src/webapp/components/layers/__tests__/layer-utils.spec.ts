import {
    DENGUE,
    GAMBIAE,
    MALARIA,
    MONO_OXYGENASES,
    STEPHENSI,
} from "../../../../domain/entities/__fixtures__/studyValues";
import { createInvasiveFilters, createPreventionFilters } from "../../../store/__fixtures__/filtersFixtures";
import { PreventionMapType } from "../../../store/types";
import { haveFiltersChanged } from "../layer-utils";

describe("haveFiltersChanged", () => {
    describe("prevention filters", () => {
        it("is false when every filter holds the same value, in new arrays", () => {
            const previous = createPreventionFilters({ disease: MALARIA, species: [GAMBIAE] });
            const next = createPreventionFilters({ disease: MALARIA, species: [GAMBIAE] });

            expect(haveFiltersChanged(previous, next)).toBe(false);
        });

        it("is true when the disease switches back to malaria", () => {
            const previous = createPreventionFilters({ disease: DENGUE });
            const next = createPreventionFilters({ disease: MALARIA });

            expect(haveFiltersChanged(previous, next)).toBe(true);
        });

        it("is true when the disease is set for the first time", () => {
            const previous = createPreventionFilters({ disease: undefined });
            const next = createPreventionFilters({ disease: MALARIA });

            expect(haveFiltersChanged(previous, next)).toBe(true);
        });

        it("is true when the proxy type of Level of involvement changes", () => {
            const mapType = PreventionMapType.LEVEL_OF_INVOLVEMENT;
            const previous = createPreventionFilters({ mapType, proxyType: null });
            const next = createPreventionFilters({ mapType, proxyType: MONO_OXYGENASES });

            expect(haveFiltersChanged(previous, next)).toBe(true);
        });

        it("is true when a selected value is swapped for another, keeping the count", () => {
            const previous = createPreventionFilters({ species: [GAMBIAE] });
            const next = createPreventionFilters({ species: [STEPHENSI] });

            expect(haveFiltersChanged(previous, next)).toBe(true);
        });
    });

    describe("invasive filters", () => {
        it("is false when every filter holds the same value, in new arrays", () => {
            const previous = createInvasiveFilters({ disease: DENGUE, vectorSpecies: [STEPHENSI] });
            const next = createInvasiveFilters({ disease: DENGUE, vectorSpecies: [STEPHENSI] });

            expect(haveFiltersChanged(previous, next)).toBe(false);
        });

        it("is true when the disease switches, with no species selected", () => {
            const previous = createInvasiveFilters({ disease: MALARIA, vectorSpecies: [] });
            const next = createInvasiveFilters({ disease: DENGUE, vectorSpecies: [] });

            expect(haveFiltersChanged(previous, next)).toBe(true);
        });
    });
});
