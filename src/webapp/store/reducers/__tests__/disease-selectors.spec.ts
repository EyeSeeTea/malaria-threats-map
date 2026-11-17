import {
    createInvasiveStudyOf,
    DENGUE_PREVENTION_STUDY,
    MALARIA_PREVENTION_STUDY,
    PREVENTION_STUDY_WITHOUT_DISEASE,
} from "../../../../domain/entities/__fixtures__/studyFixtures";
import { DENGUE, MALARIA } from "../../../../domain/entities/__fixtures__/studyValues";
import { createStateAfter } from "../../__fixtures__/stateFixtures";
import { fetchResistanceStatusTypeStudiesSuccess, setPreventionDisease } from "../../actions/prevention-actions";
import { fetchInvasiveStudiesSuccess, setInvasiveDisease } from "../../actions/invasive-actions";
import { selectPreventionStudiesOfDefaultDisease, selectPreventionStudiesOfMapTypeFrom } from "../prevention-reducer";
import { selectInvasiveStudiesOfDefaultDisease, selectInvasiveStudiesOfDisease } from "../invasive-reducer";

const preventionStateWith = (disease: string | undefined) =>
    createStateAfter([
        fetchResistanceStatusTypeStudiesSuccess([
            MALARIA_PREVENTION_STUDY,
            DENGUE_PREVENTION_STUDY,
            PREVENTION_STUDY_WITHOUT_DISEASE,
        ]),
        setPreventionDisease(disease),
    ]);

const invasiveMalaria = createInvasiveStudyOf(MALARIA, { OBJECTID: 1 });
const invasiveDengue = createInvasiveStudyOf(DENGUE, { OBJECTID: 2 });
const invasiveWithoutDisease = createInvasiveStudyOf(undefined, { OBJECTID: 3 });

const invasiveStateWith = (disease: string | undefined) =>
    createStateAfter([
        fetchInvasiveStudiesSuccess([invasiveMalaria, invasiveDengue, invasiveWithoutDisease]),
        setInvasiveDisease(disease),
    ]);

describe("disease selectors", () => {
    describe("selectPreventionStudiesOfMapTypeFrom", () => {
        it("gives the map only the studies of the chosen disease, never one without a disease", () => {
            expect(selectPreventionStudiesOfMapTypeFrom(preventionStateWith(DENGUE), "map")).toEqual([
                DENGUE_PREVENTION_STUDY,
            ]);
        });

        it("gives the map no study while no disease is set", () => {
            expect(selectPreventionStudiesOfMapTypeFrom(preventionStateWith(undefined), "map")).toEqual([]);
        });

        it("gives Data Download only the malaria studies, whatever the disease of the map", () => {
            expect(selectPreventionStudiesOfMapTypeFrom(preventionStateWith(DENGUE), "download")).toEqual([
                MALARIA_PREVENTION_STUDY,
            ]);
        });
    });

    describe("selectInvasiveStudiesOfDisease", () => {
        it("gives only the studies of the chosen disease, never one without a disease", () => {
            expect(selectInvasiveStudiesOfDisease(invasiveStateWith(MALARIA))).toEqual([invasiveMalaria]);
        });

        it("gives no study while no disease is set", () => {
            expect(selectInvasiveStudiesOfDisease(invasiveStateWith(undefined))).toEqual([]);
        });
    });

    // The Data Download and Dashboards sections keep working as before the new vectors: with malaria only.
    describe("the studies of the default disease", () => {
        it("give Data Download and the Dashboards only the malaria prevention studies, whatever the map shows", () => {
            expect(selectPreventionStudiesOfDefaultDisease(preventionStateWith(DENGUE))).toEqual([
                MALARIA_PREVENTION_STUDY,
            ]);
        });

        it("give Data Download only the malaria invasive studies, whatever the map shows", () => {
            expect(selectInvasiveStudiesOfDefaultDisease(invasiveStateWith(DENGUE))).toEqual([invasiveMalaria]);
        });
    });
});
