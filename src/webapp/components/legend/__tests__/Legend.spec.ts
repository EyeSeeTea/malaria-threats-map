import { DENGUE, MALARIA } from "../../../../domain/entities/__fixtures__/studyValues";
import { DIAGNOSIS_THEME, INVASIVE_THEME, PREVENTION_THEME } from "../../../store/__fixtures__/filtersFixtures";
import { showsLegendNotice } from "../Legend";

describe("Legend", () => {
    describe("showsLegendNotice", () => {
        it("shows the notice on the diagnosis maps, which are always on malaria", () => {
            expect(showsLegendNotice(DIAGNOSIS_THEME, MALARIA)).toBe(true);
        });

        it("shows the notice on the invasive map while no disease is set, as the map does today", () => {
            expect(showsLegendNotice(INVASIVE_THEME, undefined)).toBe(true);
        });

        it("shows the notice on the invasive map for malaria", () => {
            expect(showsLegendNotice(INVASIVE_THEME, MALARIA)).toBe(true);
        });

        it("hides the notice on the invasive map for another disease", () => {
            expect(showsLegendNotice(INVASIVE_THEME, DENGUE)).toBe(false);
        });

        it("hides the notice on the other themes", () => {
            expect(showsLegendNotice(PREVENTION_THEME, MALARIA)).toBe(false);
        });
    });
});
