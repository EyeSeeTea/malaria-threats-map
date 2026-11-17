import { DENGUE, MALARIA } from "../../../../../../domain/entities/__fixtures__/studyValues";
import { showsAnophelesReportLink } from "../VectorOccuranceFilters";

describe("VectorOccuranceFilters", () => {
    describe("showsAnophelesReportLink", () => {
        it("shows the link while no disease is set, as the map does today", () => {
            expect(showsAnophelesReportLink(undefined)).toBe(true);
        });

        it("shows the link for malaria", () => {
            expect(showsAnophelesReportLink(MALARIA)).toBe(true);
        });

        it("hides the link for another disease", () => {
            expect(showsAnophelesReportLink(DENGUE)).toBe(false);
        });
    });
});
