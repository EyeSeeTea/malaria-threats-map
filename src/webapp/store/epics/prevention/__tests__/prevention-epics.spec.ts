import { firstValueFrom, of } from "rxjs";
import { toArray } from "rxjs/operators";
import { AnyAction } from "redux";
import {
    fetchResistanceMechanismTypeStudiesSuccess,
    fetchResistanceStatusTypeStudiesSuccess,
    fetchSynergistEffectTypeStudiesSuccess,
    setAssayTypes,
    setInsecticideClass,
    setPreventionDisease,
    setPreventionMapType,
    setProxyType,
    setSynergistTypes,
    setType,
} from "../../../actions/prevention-actions";
import {
    resetPreventionFiltersOnDiseaseSwitchEpic,
    setInitialPreventionDiseaseEpic,
    setPreventionMapTypeEpic,
    setPreventionTypeEpic,
} from "../prevention-epics";
import {
    ACE1R,
    BIOCHEMICAL,
    CARBAMATES,
    DENGUE,
    ESTERASES,
    GSTS,
    KDR_L1014F,
    KDR_L1014S,
    KDR_UNSPECIFIED,
    MALARIA,
    MOLECULAR,
    MONO_OXYGENASES,
    ORGANOPHOSPHATES,
    PYRETHROIDS,
    SYNERGIST,
    UNKNOWN_MECHANISM,
} from "../../../../../domain/entities/__fixtures__/studyValues";
import { createPreventionStudy } from "../../../../../domain/entities/__fixtures__/studyFixtures";
import { PreventionStudy } from "../../../../../domain/entities/PreventionStudy";
import { createStateAfter } from "../../../__fixtures__/stateFixtures";
import { ActionTypeEnum } from "../../../actions";
import { PreventionMapType, State } from "../../../types";
import { fetchTranslationsSuccessAction } from "../../../actions/translations-actions";
import {
    createProxyTypeTranslations,
    createTranslationResponse,
} from "../../../../types/__fixtures__/translationFixtures";
import { collectActions, createStateObservable } from "../../../__fixtures__/epicFixtures";

function actionsAfterSetType(types: string[] | undefined) {
    return firstValueFrom(setPreventionTypeEpic(of(setType(types))).pipe(toArray()));
}

describe("setPreventionTypeEpic", () => {
    it.each([KDR_L1014S, KDR_L1014F, KDR_UNSPECIFIED])("selects only the molecular assay for %s", async mechanism => {
        expect(await actionsAfterSetType([mechanism])).toEqual([setAssayTypes([MOLECULAR])]);
    });

    it("selects the molecular and biochemical assays for ACE1R", async () => {
        expect(await actionsAfterSetType([ACE1R])).toEqual([setAssayTypes([MOLECULAR, BIOCHEMICAL])]);
    });

    it.each([MONO_OXYGENASES, ESTERASES, GSTS, UNKNOWN_MECHANISM])(
        "selects the three assay types for %s",
        async mechanism => {
            expect(await actionsAfterSetType([mechanism])).toEqual([
                setAssayTypes([MOLECULAR, BIOCHEMICAL, SYNERGIST]),
            ]);
        }
    );

    it("selects the three assay types for an empty list and for undefined", async () => {
        const allAssayTypes = [setAssayTypes([MOLECULAR, BIOCHEMICAL, SYNERGIST])];

        expect(await actionsAfterSetType([])).toEqual(allAssayTypes);
        expect(await actionsAfterSetType(undefined)).toEqual(allAssayTypes);
    });

    // The filter allows one mechanism, so only the first one decides the assay types.
    // A change that allows several must revisit this epic.
    it("looks only at the first selected mechanism", async () => {
        expect(await actionsAfterSetType([KDR_L1014S, MONO_OXYGENASES])).toEqual([setAssayTypes([MOLECULAR])]);
        expect(await actionsAfterSetType([MONO_OXYGENASES, KDR_L1014S])).toEqual([
            setAssayTypes([MOLECULAR, BIOCHEMICAL, SYNERGIST]),
        ]);
    });
});

const study = (DISEASE: string | undefined, overrides: Partial<PreventionStudy> = {}) =>
    createPreventionStudy({ DISEASE, ...overrides });

const classStudy = (DISEASE: string | undefined, INSECTICIDE_CLASS: string) => study(DISEASE, { INSECTICIDE_CLASS });
const mechanismStudy = (DISEASE: string | undefined, TYPE: string) => study(DISEASE, { TYPE });
const involvementStudy = (DISEASE: string | undefined, PROXY_TYPE: string) =>
    study(DISEASE, { PROXY_TYPE, INSECTICIDE_CLASS: PYRETHROIDS });

const proxyTypeTranslations = (values: ReadonlyArray<string>) =>
    fetchTranslationsSuccessAction(createTranslationResponse(createProxyTypeTranslations(values)));

// The actions a map change sets for the class and the mechanism, leaving out its date resets and page view.
const classAndMechanismActions: ReadonlyArray<string> = [
    ActionTypeEnum.SetType,
    ActionTypeEnum.SetProxyType,
    ActionTypeEnum.SetInsecticideClass,
];

describe("disease epics", () => {
    describe("setInitialPreventionDiseaseEpic", () => {
        const initialDiseaseAfter = (state: State, action: AnyAction) =>
            collectActions(setInitialPreventionDiseaseEpic(of(action), createStateObservable(state)));

        it("sets malaria when the loaded studies carry malaria and another disease", async () => {
            const loaded = fetchResistanceStatusTypeStudiesSuccess([study(DENGUE), study(MALARIA)]);

            expect(await initialDiseaseAfter(createStateAfter([loaded]), loaded)).toEqual([
                setPreventionDisease(MALARIA),
            ]);
        });

        it("sets the first disease when the loaded studies carry no malaria", async () => {
            const loaded = fetchResistanceStatusTypeStudiesSuccess([study(DENGUE)]);

            expect(await initialDiseaseAfter(createStateAfter([loaded]), loaded)).toEqual([
                setPreventionDisease(DENGUE),
            ]);
        });

        it("sets nothing when the studies carry no disease", async () => {
            const loaded = fetchResistanceStatusTypeStudiesSuccess([study(undefined)]);

            expect(await initialDiseaseAfter(createStateAfter([loaded]), loaded)).toEqual([]);
        });

        it("keeps the disease of the URL, set before the studies load", async () => {
            const loaded = fetchResistanceStatusTypeStudiesSuccess([study(MALARIA), study(DENGUE)]);
            const state = createStateAfter([setPreventionDisease(DENGUE), loaded]);

            expect(await initialDiseaseAfter(state, loaded)).toEqual([]);
        });

        it("sets it again when the URL unsets it and the studies are loaded", async () => {
            const unset = setPreventionDisease(undefined);
            const state = createStateAfter([fetchResistanceStatusTypeStudiesSuccess([study(MALARIA)]), unset]);

            expect(await initialDiseaseAfter(state, unset)).toEqual([setPreventionDisease(MALARIA)]);
        });
    });

    describe("resetPreventionFiltersOnDiseaseSwitchEpic", () => {
        const actionsAfterDiseases = (diseases: ReadonlyArray<string>, loaded: ReadonlyArray<AnyAction>) => {
            const diseaseActions = diseases.map(disease => setPreventionDisease(disease));
            const state = createStateAfter([...loaded, ...diseaseActions]);
            return collectActions(
                resetPreventionFiltersOnDiseaseSwitchEpic(of(...diseaseActions), createStateObservable(state))
            );
        };

        const statusStudies = fetchResistanceStatusTypeStudiesSuccess([
            classStudy(MALARIA, PYRETHROIDS),
            classStudy(DENGUE, PYRETHROIDS),
            classStudy(DENGUE, ORGANOPHOSPHATES),
        ]);

        it("empties nothing the first time the disease is set", async () => {
            expect(await actionsAfterDiseases([MALARIA], [statusStudies])).toEqual([]);
        });

        it("empties nothing when the same disease is set again", async () => {
            expect(await actionsAfterDiseases([DENGUE, DENGUE], [statusStudies])).toEqual([]);
        });

        describe("on Resistance status, where the class is the top filter", () => {
            it("sets the default class when the new disease offers it", async () => {
                expect(await actionsAfterDiseases([MALARIA, DENGUE], [statusStudies])).toEqual([
                    setSynergistTypes([]),
                    setInsecticideClass(PYRETHROIDS),
                ]);
            });

            it("sets the first class in the filter's order when the new disease has no default class", async () => {
                const studies = fetchResistanceStatusTypeStudiesSuccess([
                    classStudy(MALARIA, PYRETHROIDS),
                    classStudy(DENGUE, ORGANOPHOSPHATES),
                    classStudy(DENGUE, CARBAMATES),
                ]);

                expect(await actionsAfterDiseases([MALARIA, DENGUE], [studies])).toEqual([
                    setSynergistTypes([]),
                    setInsecticideClass(CARBAMATES),
                ]);
            });
        });

        describe("on Resistance mechanisms, where the mechanism is the top filter", () => {
            const toMechanismMap = setPreventionMapType(PreventionMapType.RESISTANCE_MECHANISM);

            it("sets the default mechanism when the new disease offers it, and leaves the class alone", async () => {
                const studies = fetchResistanceMechanismTypeStudiesSuccess([
                    mechanismStudy(MALARIA, KDR_L1014S),
                    mechanismStudy(DENGUE, GSTS),
                    mechanismStudy(DENGUE, MONO_OXYGENASES),
                ]);

                expect(await actionsAfterDiseases([MALARIA, DENGUE], [studies, toMechanismMap])).toEqual([
                    setSynergistTypes([]),
                    setType([MONO_OXYGENASES]),
                ]);
            });

            it("sets the first mechanism of the catalogue when the new disease has no default one", async () => {
                const studies = fetchResistanceMechanismTypeStudiesSuccess([
                    mechanismStudy(MALARIA, MONO_OXYGENASES),
                    mechanismStudy(DENGUE, GSTS),
                    mechanismStudy(DENGUE, ESTERASES),
                ]);

                expect(await actionsAfterDiseases([MALARIA, DENGUE], [studies, toMechanismMap])).toEqual([
                    setSynergistTypes([]),
                    setType([ESTERASES]),
                ]);
            });
        });

        describe("on Level of involvement, where the class and the mechanism are top filters", () => {
            it("sets the mechanism and the class among the options of the new disease", async () => {
                const studies = fetchSynergistEffectTypeStudiesSuccess([
                    involvementStudy(MALARIA, MONO_OXYGENASES),
                    involvementStudy(DENGUE, ESTERASES),
                ]);
                const loaded = [
                    studies,
                    proxyTypeTranslations([MONO_OXYGENASES, ESTERASES]),
                    setPreventionMapType(PreventionMapType.LEVEL_OF_INVOLVEMENT),
                ];

                expect(await actionsAfterDiseases([MALARIA, DENGUE], loaded)).toEqual([
                    setSynergistTypes([]),
                    setProxyType(ESTERASES),
                    setInsecticideClass(PYRETHROIDS),
                ]);
            });
        });

        it("sets the defaults when the studies of the map are not loaded yet", async () => {
            expect(await actionsAfterDiseases([MALARIA, DENGUE], [])).toEqual([
                setSynergistTypes([]),
                setInsecticideClass(PYRETHROIDS),
            ]);
        });
    });

    describe("setPreventionMapTypeEpic, the class and the mechanism of a map change", () => {
        const classAndMechanismAfterMapChange = async (
            mapType: PreventionMapType,
            before: ReadonlyArray<AnyAction>
        ) => {
            const toMap = setPreventionMapType(mapType);
            const state = createStateAfter([...before, toMap]);
            const actions = await collectActions(setPreventionMapTypeEpic(of(toMap), createStateObservable(state)));
            return actions.filter(action => classAndMechanismActions.includes(action.type));
        };

        const mechanismStudies = fetchResistanceMechanismTypeStudiesSuccess([
            mechanismStudy(MALARIA, MONO_OXYGENASES),
            mechanismStudy(DENGUE, GSTS),
            mechanismStudy(DENGUE, ESTERASES),
        ]);

        const statusStudies = fetchResistanceStatusTypeStudiesSuccess([
            classStudy(MALARIA, PYRETHROIDS),
            classStudy(DENGUE, PYRETHROIDS),
            classStudy(DENGUE, ORGANOPHOSPHATES),
        ]);

        describe("with malaria or without a disease, as today", () => {
            it.each([
                ["malaria", MALARIA],
                ["no disease", undefined],
            ])("sets the default mechanism on Resistance mechanisms with %s", async (_case, disease) => {
                const before = [mechanismStudies, setPreventionDisease(disease)];

                expect(await classAndMechanismAfterMapChange(PreventionMapType.RESISTANCE_MECHANISM, before)).toEqual([
                    setType([MONO_OXYGENASES]),
                ]);
            });

            it("keeps a class the new map does not offer", async () => {
                const before = [statusStudies, setPreventionDisease(MALARIA), setInsecticideClass(CARBAMATES)];

                expect(await classAndMechanismAfterMapChange(PreventionMapType.RESISTANCE_STATUS, before)).toEqual([
                    setType(undefined),
                ]);
            });
        });

        describe("with another disease", () => {
            it("sets the first mechanism of the disease when it has no default one", async () => {
                const before = [mechanismStudies, setPreventionDisease(DENGUE)];

                expect(await classAndMechanismAfterMapChange(PreventionMapType.RESISTANCE_MECHANISM, before)).toEqual([
                    setType([ESTERASES]),
                ]);
            });

            it("moves a class the new map does not offer to the default class", async () => {
                const before = [statusStudies, setPreventionDisease(DENGUE), setInsecticideClass(CARBAMATES)];

                expect(await classAndMechanismAfterMapChange(PreventionMapType.RESISTANCE_STATUS, before)).toEqual([
                    setType(undefined),
                    setInsecticideClass(PYRETHROIDS),
                ]);
            });

            it("keeps a class the new map offers", async () => {
                const before = [statusStudies, setPreventionDisease(DENGUE), setInsecticideClass(ORGANOPHOSPHATES)];

                expect(await classAndMechanismAfterMapChange(PreventionMapType.RESISTANCE_STATUS, before)).toEqual([
                    setType(undefined),
                ]);
            });

            it("sets the mechanism of Level of involvement among the options of the disease", async () => {
                const before = [
                    fetchSynergistEffectTypeStudiesSuccess([
                        involvementStudy(MALARIA, MONO_OXYGENASES),
                        involvementStudy(DENGUE, ESTERASES),
                    ]),
                    proxyTypeTranslations([MONO_OXYGENASES, ESTERASES]),
                    setPreventionDisease(DENGUE),
                    setInsecticideClass(PYRETHROIDS),
                ];

                expect(await classAndMechanismAfterMapChange(PreventionMapType.LEVEL_OF_INVOLVEMENT, before)).toEqual([
                    setProxyType(ESTERASES),
                ]);
            });
        });
    });
});
