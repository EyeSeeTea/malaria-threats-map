import { of } from "rxjs";
import { AnyAction } from "redux";
import {
    fetchInvasiveStudiesSuccess,
    setInvasiveDisease,
    setInvasiveVectorSpecies,
} from "../../../actions/invasive-actions";
import { resetInvasiveFiltersOnDiseaseSwitchEpic, setInitialInvasiveDiseaseEpic } from "../invasive-epics";
import { createInvasiveStudy } from "../../../../../domain/entities/__fixtures__/studyFixtures";
import { DENGUE, MALARIA } from "../../../../../domain/entities/__fixtures__/studyValues";
import { createStateAfter } from "../../../__fixtures__/stateFixtures";
import { State } from "../../../types";
import { collectActions, createStateObservable } from "../../../__fixtures__/epicFixtures";

const study = (DISEASE: string | undefined) => createInvasiveStudy({ DISEASE });

describe("invasive disease epics", () => {
    describe("setInitialInvasiveDiseaseEpic", () => {
        const initialDiseaseAfter = (state: State, action: AnyAction) =>
            collectActions(setInitialInvasiveDiseaseEpic(of(action), createStateObservable(state)));

        it("sets malaria when the loaded studies carry malaria and another disease", async () => {
            const loaded = fetchInvasiveStudiesSuccess([study(DENGUE), study(MALARIA)]);

            expect(await initialDiseaseAfter(createStateAfter([loaded]), loaded)).toEqual([
                setInvasiveDisease(MALARIA),
            ]);
        });

        it("sets nothing when the studies carry no disease", async () => {
            const loaded = fetchInvasiveStudiesSuccess([study(undefined)]);

            expect(await initialDiseaseAfter(createStateAfter([loaded]), loaded)).toEqual([]);
        });

        it("keeps the disease of the URL, set before the studies load", async () => {
            const loaded = fetchInvasiveStudiesSuccess([study(MALARIA), study(DENGUE)]);
            const state = createStateAfter([setInvasiveDisease(DENGUE), loaded]);

            expect(await initialDiseaseAfter(state, loaded)).toEqual([]);
        });
    });

    describe("resetInvasiveFiltersOnDiseaseSwitchEpic", () => {
        const actionsAfterDiseases = (diseases: ReadonlyArray<string>) =>
            collectActions(resetInvasiveFiltersOnDiseaseSwitchEpic(of(...diseases.map(d => setInvasiveDisease(d)))));

        it("empties nothing the first time the disease is set", async () => {
            expect(await actionsAfterDiseases([MALARIA])).toEqual([]);
        });

        it("empties the vector species on a switch", async () => {
            expect(await actionsAfterDiseases([MALARIA, DENGUE])).toEqual([setInvasiveVectorSpecies([])]);
        });

        it("empties nothing when the same disease is set again", async () => {
            expect(await actionsAfterDiseases([DENGUE, DENGUE])).toEqual([]);
        });
    });
});
