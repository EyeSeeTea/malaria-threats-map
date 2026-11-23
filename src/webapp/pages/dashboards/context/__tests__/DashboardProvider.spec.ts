import {
    createPreventionStudyOf,
    createTreatmentStudy,
} from "../../../../../domain/entities/__fixtures__/studyFixtures";
import { DENGUE, MALARIA } from "../../../../../domain/entities/__fixtures__/studyValues";
import { createStateAfter } from "../../../../store/__fixtures__/stateFixtures";
import { fetchResistanceStatusTypeStudiesSuccess } from "../../../../store/actions/prevention-actions";
import { fetchTreatmentStudiesSuccess } from "../../../../store/actions/treatment-actions";
import { selectDashboardStudiesLoaded } from "../DashboardProvider";

const treatmentLoaded = () => fetchTreatmentStudiesSuccess([createTreatmentStudy()]);

describe("selectDashboardStudiesLoaded", () => {
    it("is true when the prevention and treatment studies have arrived", () => {
        const state = createStateAfter([
            fetchResistanceStatusTypeStudiesSuccess([createPreventionStudyOf(MALARIA)]),
            treatmentLoaded(),
        ]);

        expect(selectDashboardStudiesLoaded(state)).toBe(true);
    });

    // The dashboards show only the default disease. With no study of it they show empty, not loading forever.
    it("is true when no prevention study is of the default disease", () => {
        const state = createStateAfter([
            fetchResistanceStatusTypeStudiesSuccess([
                createPreventionStudyOf(undefined),
                createPreventionStudyOf(DENGUE),
            ]),
            treatmentLoaded(),
        ]);

        expect(selectDashboardStudiesLoaded(state)).toBe(true);
    });

    it("is false while the prevention studies have not arrived", () => {
        expect(selectDashboardStudiesLoaded(createStateAfter([treatmentLoaded()]))).toBe(false);
    });

    it("is false while the treatment studies have not arrived", () => {
        const state = createStateAfter([fetchResistanceStatusTypeStudiesSuccess([createPreventionStudyOf(MALARIA)])]);

        expect(selectDashboardStudiesLoaded(state)).toBe(false);
    });
});
