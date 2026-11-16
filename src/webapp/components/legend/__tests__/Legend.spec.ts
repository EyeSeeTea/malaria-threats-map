import { DENGUE, MALARIA } from "../../../../domain/entities/__fixtures__/studyValues";
import { showsLegendNotice } from "../Legend";

const DIAGNOSIS = "diagnosis";
const INVASIVE = "invasive";
const PREVENTION = "prevention";

describe("Legend", () => {
    describe("showsLegendNotice", () => {
        it("shows the notice on the diagnosis maps, whatever the invasive disease", () => {
            expect(showsLegendNotice(DIAGNOSIS, DENGUE)).toBe(true);
        });

        it("shows the notice on the invasive map while no disease is set, as the map does today", () => {
            expect(showsLegendNotice(INVASIVE, undefined)).toBe(true);
        });

        it("shows the notice on the invasive map for malaria", () => {
            expect(showsLegendNotice(INVASIVE, MALARIA)).toBe(true);
        });

        it("hides the notice on the invasive map for another disease", () => {
            expect(showsLegendNotice(INVASIVE, DENGUE)).toBe(false);
        });

        it("hides the notice on the other themes", () => {
            expect(showsLegendNotice(PREVENTION, MALARIA)).toBe(false);
        });
    });
});
