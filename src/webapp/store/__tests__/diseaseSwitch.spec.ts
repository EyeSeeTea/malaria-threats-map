import { AnyAction, applyMiddleware, createStore } from "redux";
import { createEpicMiddleware } from "redux-observable";
import rootEpic from "../epics";
import createRootReducer from "../reducers";
import {
    fetchResistanceMechanismTypeStudiesSuccess,
    fetchResistanceStatusTypeStudiesSuccess,
    setInsecticideClass,
    setInsecticideTypes,
    setPreventionDisease,
    setPreventionMapType,
    setSpecies,
    setType,
} from "../actions/prevention-actions";
import { PreventionMapType } from "../types";
import { createPreventionStudy } from "../../../domain/entities/__fixtures__/studyFixtures";
import {
    BIOCHEMICAL,
    DELTAMETHRIN,
    DENGUE,
    ESTERASES,
    GAMBIAE,
    GSTS,
    KDR_L1014S,
    MALARIA,
    MOLECULAR,
    ORGANOPHOSPHATES,
    PERMETHRIN,
    PYRETHROIDS,
    SYNERGIST,
    WHO_TEST_KIT,
} from "../../../domain/entities/__fixtures__/studyValues";

// The disease epic sets only the top filter of the map; these tests run the whole store, reducers and
// every epic of the app, to pin that the existing chain then empties the filters below it.

// What the URL sync dispatches when the map opens without filters in the URL. Each chain epic skips
// the first action of its type, so a test must start from here, as the app does.
const appOpened: ReadonlyArray<AnyAction> = [
    setInsecticideClass(PYRETHROIDS),
    setInsecticideTypes(undefined),
    setType(undefined),
    setSpecies(undefined),
];

// The epics that load studies read the composition root from the dependencies when they start. These
// tests load the studies with success actions, so the epics never call it.
const noDependencies = {};

function storeAfter(actions: ReadonlyArray<AnyAction>) {
    const epicMiddleware = createEpicMiddleware<AnyAction, AnyAction>({ dependencies: noDependencies });
    const store = createStore(createRootReducer(), applyMiddleware(epicMiddleware));
    epicMiddleware.run(rootEpic);
    [...appOpened, ...actions].forEach(action => store.dispatch(action));
    return store;
}

describe("a disease switch through the store", () => {
    it("on Resistance status, empties the insecticide types, the test type and the species", () => {
        const studies = fetchResistanceStatusTypeStudiesSuccess([
            createPreventionStudy({ DISEASE: MALARIA, INSECTICIDE_TYPE: DELTAMETHRIN }),
            createPreventionStudy({ DISEASE: DENGUE, INSECTICIDE_TYPE: PERMETHRIN }),
        ]);

        const store = storeAfter([
            studies,
            setPreventionDisease(MALARIA),
            setInsecticideTypes([DELTAMETHRIN]),
            setType([WHO_TEST_KIT]),
            setSpecies([GAMBIAE]),
            setPreventionDisease(DENGUE),
        ]);

        const { disease, insecticideClass, insecticideTypes, type, species } = store.getState().prevention.filters;
        expect({ disease, insecticideClass, insecticideTypes, type, species }).toEqual({
            disease: DENGUE,
            insecticideClass: PYRETHROIDS,
            insecticideTypes: [],
            type: undefined,
            species: [],
        });
    });

    it("on Resistance mechanisms, sets the mechanism of the new disease and keeps it", () => {
        const studies = fetchResistanceMechanismTypeStudiesSuccess([
            createPreventionStudy({ DISEASE: MALARIA, TYPE: KDR_L1014S }),
            createPreventionStudy({ DISEASE: DENGUE, TYPE: GSTS }),
            createPreventionStudy({ DISEASE: DENGUE, TYPE: ESTERASES }),
        ]);

        const store = storeAfter([
            studies,
            setPreventionMapType(PreventionMapType.RESISTANCE_MECHANISM),
            setPreventionDisease(MALARIA),
            setType([KDR_L1014S]),
            setSpecies([GAMBIAE]),
            setPreventionDisease(DENGUE),
        ]);

        const { disease, type, assayTypes, species } = store.getState().prevention.filters;
        expect({ disease, type, assayTypes, species }).toEqual({
            disease: DENGUE,
            type: [ESTERASES],
            assayTypes: [MOLECULAR, BIOCHEMICAL, SYNERGIST],
            species: [],
        });
    });

    it("after a switch on Resistance mechanisms, moves the class on the next map to one the disease offers", () => {
        const store = storeAfter([
            fetchResistanceMechanismTypeStudiesSuccess([createPreventionStudy({ DISEASE: DENGUE, TYPE: GSTS })]),
            fetchResistanceStatusTypeStudiesSuccess([
                createPreventionStudy({ DISEASE: MALARIA, INSECTICIDE_CLASS: PYRETHROIDS }),
                createPreventionStudy({ DISEASE: DENGUE, INSECTICIDE_CLASS: ORGANOPHOSPHATES }),
            ]),
            setPreventionMapType(PreventionMapType.RESISTANCE_MECHANISM),
            setPreventionDisease(MALARIA),
            setInsecticideTypes([DELTAMETHRIN]),
            setPreventionDisease(DENGUE),
            setPreventionMapType(PreventionMapType.RESISTANCE_STATUS),
        ]);

        const { insecticideClass, insecticideTypes } = store.getState().prevention.filters;
        expect({ insecticideClass, insecticideTypes }).toEqual({
            insecticideClass: ORGANOPHOSPHATES,
            insecticideTypes: [],
        });
    });
});
