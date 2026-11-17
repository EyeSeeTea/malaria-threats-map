import {
    DENGUE_PREVENTION_STUDY,
    MALARIA_PREVENTION_STUDY,
    PREVENTION_STUDY_WITHOUT_DISEASE,
} from "../../../../../domain/entities/__fixtures__/studyFixtures";
import { DENGUE } from "../../../../../domain/entities/__fixtures__/studyValues";
import { getStudiesForYearRange } from "../yearRange";

const studies = [MALARIA_PREVENTION_STUDY, DENGUE_PREVENTION_STUDY, PREVENTION_STUDY_WITHOUT_DISEASE];

describe("getStudiesForYearRange", () => {
    it("takes the studies of the chosen disease", () => {
        expect(getStudiesForYearRange(studies, DENGUE)).toEqual([DENGUE_PREVENTION_STUDY]);
    });

    it("takes every study while no disease is set, as before the disease filter", () => {
        expect(getStudiesForYearRange(studies, undefined)).toEqual(studies);
    });
});
