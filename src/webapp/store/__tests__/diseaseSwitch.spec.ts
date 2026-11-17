import {
    fetchResistanceMechanismTypeStudiesSuccess,
    fetchResistanceStatusTypeStudiesSuccess,
    setInsecticideTypes,
    setPreventionDisease,
    setPreventionMapType,
    setSpecies,
    setType,
} from "../actions/prevention-actions";
import { PreventionMapType } from "../types";
import { createPreventionStudyOf } from "../../../domain/entities/__fixtures__/studyFixtures";
import { createTestStoreAfter } from "../__fixtures__/storeFixtures";
import {
    BIOCHEMICAL_ASSAY,
    DELTAMETHRIN,
    DENGUE,
    ESTERASES,
    GAMBIAE,
    GSTS,
    KDR_L1014S,
    MALARIA,
    MOLECULAR_ASSAY,
    PERMETHRIN,
    PYRETHROIDS,
    SYNERGIST_ASSAY,
    WHO_TEST_KIT,
} from "../../../domain/entities/__fixtures__/studyValues";

// The disease epic sets only the top filter of the map; these tests run the whole store, reducers and
// every epic of the app, to pin that the existing chain then empties the filters below it.

describe("a disease switch through the store", () => {
    it("on Resistance status, empties the insecticide types, the test type and the species", () => {
        const studies = fetchResistanceStatusTypeStudiesSuccess([
            createPreventionStudyOf(MALARIA, { INSECTICIDE_TYPE: DELTAMETHRIN }),
            createPreventionStudyOf(DENGUE, { INSECTICIDE_TYPE: PERMETHRIN }),
        ]);

        const store = createTestStoreAfter([
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
            createPreventionStudyOf(MALARIA, { TYPE: KDR_L1014S }),
            createPreventionStudyOf(DENGUE, { TYPE: GSTS }),
            createPreventionStudyOf(DENGUE, { TYPE: ESTERASES }),
        ]);

        const store = createTestStoreAfter([
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
            assayTypes: [MOLECULAR_ASSAY, BIOCHEMICAL_ASSAY, SYNERGIST_ASSAY],
            species: [],
        });
    });
});
