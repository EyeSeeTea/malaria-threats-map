import { createInvasiveStudy, createPreventionStudy } from "../../../../domain/entities/__fixtures__/studyFixtures";
import { DENGUE, MALARIA } from "../../../../domain/entities/__fixtures__/studyValues";
import { createStateAfter } from "../../__fixtures__/stateFixtures";
import { fetchResistanceStatusTypeStudiesSuccess, setPreventionDisease } from "../../actions/prevention-actions";
import { fetchInvasiveStudiesSuccess, setInvasiveDisease } from "../../actions/invasive-actions";
import { selectPreventionStudiesOfMapTypeFrom } from "../prevention-reducer";
import { selectInvasiveStudiesOfDisease } from "../invasive-reducer";

const malariaStudy = createPreventionStudy({ OBJECTID: 1, DISEASE: MALARIA });
const dengueStudy = createPreventionStudy({ OBJECTID: 2, DISEASE: DENGUE });
const studyWithoutDisease = createPreventionStudy({ OBJECTID: 3 });

const preventionStateWith = (disease: string | undefined) =>
    createStateAfter([
        fetchResistanceStatusTypeStudiesSuccess([malariaStudy, dengueStudy, studyWithoutDisease]),
        setPreventionDisease(disease),
    ]);

describe("disease selectors", () => {
    describe("selectPreventionStudiesOfMapTypeFrom", () => {
        it("gives the map only the studies of the chosen disease, never one without a disease", () => {
            expect(selectPreventionStudiesOfMapTypeFrom(preventionStateWith(DENGUE), "map")).toEqual([dengueStudy]);
        });

        it("gives Data Download every study, whatever the disease", () => {
            expect(selectPreventionStudiesOfMapTypeFrom(preventionStateWith(DENGUE), "download")).toEqual([
                malariaStudy,
                dengueStudy,
                studyWithoutDisease,
            ]);
        });

        it("gives the map no study while no disease is set", () => {
            expect(selectPreventionStudiesOfMapTypeFrom(preventionStateWith(undefined), "map")).toEqual([]);
        });
    });

    describe("selectInvasiveStudiesOfDisease", () => {
        const invasiveMalaria = createInvasiveStudy({ OBJECTID: 1, DISEASE: MALARIA });
        const invasiveDengue = createInvasiveStudy({ OBJECTID: 2, DISEASE: DENGUE });
        const invasiveWithoutDisease = createInvasiveStudy({ OBJECTID: 3 });

        it("gives only the studies of the chosen disease, never one without a disease", () => {
            const state = createStateAfter([
                fetchInvasiveStudiesSuccess([invasiveMalaria, invasiveDengue, invasiveWithoutDisease]),
                setInvasiveDisease(MALARIA),
            ]);

            expect(selectInvasiveStudiesOfDisease(state)).toEqual([invasiveMalaria]);
        });

        it("gives no study while no disease is set", () => {
            const state = createStateAfter([fetchInvasiveStudiesSuccess([invasiveMalaria, invasiveDengue])]);

            expect(selectInvasiveStudiesOfDisease(state)).toEqual([]);
        });
    });
});
