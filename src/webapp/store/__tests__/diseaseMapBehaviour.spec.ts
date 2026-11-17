import { DENGUE, MALARIA } from "../../../domain/entities/__fixtures__/studyValues";
import { replacesValuesNotOfferedOnMap } from "../diseaseMapBehaviour";

// keepsMapBehaviourBeforeDisease is pinned through showsAnophelesReportLink in VectorOccuranceFilters.spec.

describe("diseaseMapBehaviour", () => {
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
