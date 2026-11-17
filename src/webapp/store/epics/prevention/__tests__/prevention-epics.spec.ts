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
    setPreventionThemeEpic,
    setPreventionTypeEpic,
    setPreventionYearRangeOfDiseaseEpic,
} from "../prevention-epics";
import { REQUESTED_VIR_START_DATE } from "../utils";
import {
    ACE1R,
    BIOCHEMICAL_ASSAY,
    CARBAMATES,
    DENGUE,
    ESTERASES,
    GSTS,
    KDR_L1014S,
    MALARIA,
    MOLECULAR_ASSAY,
    MONO_OXYGENASES,
    ORGANOPHOSPHATES,
    PYRETHROIDS,
    SYNERGIST_ASSAY,
    UNKNOWN_MECHANISM,
} from "../../../../../domain/entities/__fixtures__/studyValues";
import {
    createPreventionStudyOf,
    CURRENT_YEAR,
    STUDY_YEAR_RANGE,
} from "../../../../../domain/entities/__fixtures__/studyFixtures";
import { createStateAfter } from "../../../__fixtures__/stateFixtures";
import { ActionTypeEnum } from "../../../actions";
import { PreventionMapType } from "../../../types";
import { fetchTranslationsSuccessAction } from "../../../actions/translations-actions";
import {
    createProxyTypeTranslations,
    createTranslationResponse,
} from "../../../../types/__fixtures__/translationFixtures";
import { runEpic } from "../../../__fixtures__/epicFixtures";
import { setFiltersAction, setMaxMinYearsAction, setThemeAction } from "../../../actions/base-actions";
import { DOWNLOAD, PREVENTION_THEME, YEAR_BEFORE_RANGE } from "../../../__fixtures__/filtersFixtures";

function actionsAfterSetType(types: string[] | undefined) {
    return runEpic(setPreventionTypeEpic, [setType(types)]);
}

// Which assay types detect each mechanism is pinned in ResistanceMechanism.spec; this spec pins what the
// epic adds: the fallback to every assay type and the first-mechanism rule.
describe("setPreventionTypeEpic", () => {
    it("selects the assay types that detect the mechanism", async () => {
        expect(await actionsAfterSetType([ACE1R])).toEqual([setAssayTypes([MOLECULAR_ASSAY, BIOCHEMICAL_ASSAY])]);
    });

    // Reachable from a link with a mechanism code the catalogue does not have.
    it("selects the three assay types for an unknown mechanism", async () => {
        expect(await actionsAfterSetType([UNKNOWN_MECHANISM])).toEqual([
            setAssayTypes([MOLECULAR_ASSAY, BIOCHEMICAL_ASSAY, SYNERGIST_ASSAY]),
        ]);
    });

    it("selects the three assay types for an empty list and for undefined", async () => {
        const allAssayTypes = [setAssayTypes([MOLECULAR_ASSAY, BIOCHEMICAL_ASSAY, SYNERGIST_ASSAY])];

        expect(await actionsAfterSetType([])).toEqual(allAssayTypes);
        expect(await actionsAfterSetType(undefined)).toEqual(allAssayTypes);
    });

    // The filter allows one mechanism, so only the first one decides the assay types.
    // A change that allows several must revisit this epic.
    it("looks only at the first selected mechanism", async () => {
        expect(await actionsAfterSetType([KDR_L1014S, MONO_OXYGENASES])).toEqual([setAssayTypes([MOLECULAR_ASSAY])]);
        expect(await actionsAfterSetType([MONO_OXYGENASES, KDR_L1014S])).toEqual([
            setAssayTypes([MOLECULAR_ASSAY, BIOCHEMICAL_ASSAY, SYNERGIST_ASSAY]),
        ]);
    });
});

const classStudy = (disease: string | undefined, INSECTICIDE_CLASS: string) =>
    createPreventionStudyOf(disease, { INSECTICIDE_CLASS });
const mechanismStudy = (disease: string | undefined, TYPE: string) => createPreventionStudyOf(disease, { TYPE });
const involvementStudy = (disease: string | undefined, PROXY_TYPE: string) =>
    createPreventionStudyOf(disease, { PROXY_TYPE, INSECTICIDE_CLASS: PYRETHROIDS });

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
        const initialDiseaseAfter = (before: ReadonlyArray<AnyAction>, action: AnyAction) =>
            runEpic(setInitialPreventionDiseaseEpic, [action], createStateAfter(before));

        it("sets malaria when the loaded studies carry malaria and another disease", async () => {
            const loaded = fetchResistanceStatusTypeStudiesSuccess([
                createPreventionStudyOf(DENGUE),
                createPreventionStudyOf(MALARIA),
            ]);

            expect(await initialDiseaseAfter([loaded], loaded)).toEqual([setPreventionDisease(MALARIA)]);
        });

        it("sets the first disease when the loaded studies carry no malaria", async () => {
            const loaded = fetchResistanceStatusTypeStudiesSuccess([createPreventionStudyOf(DENGUE)]);

            expect(await initialDiseaseAfter([loaded], loaded)).toEqual([setPreventionDisease(DENGUE)]);
        });

        it("sets nothing when the studies carry no disease", async () => {
            const loaded = fetchResistanceStatusTypeStudiesSuccess([createPreventionStudyOf(undefined)]);

            expect(await initialDiseaseAfter([loaded], loaded)).toEqual([]);
        });

        it("keeps the disease of the URL, set before the studies load, when the studies carry it", async () => {
            const loaded = fetchResistanceStatusTypeStudiesSuccess([
                createPreventionStudyOf(MALARIA),
                createPreventionStudyOf(DENGUE),
            ]);

            expect(await initialDiseaseAfter([setPreventionDisease(DENGUE), loaded], loaded)).toEqual([]);
        });

        // The disease filter is never empty: a disease from a link that the data does not carry would show it so.
        it("replaces a disease of the URL that the loaded studies do not carry", async () => {
            const loaded = fetchResistanceStatusTypeStudiesSuccess([createPreventionStudyOf(MALARIA)]);

            expect(await initialDiseaseAfter([setPreventionDisease(DENGUE), loaded], loaded)).toEqual([
                setPreventionDisease(MALARIA),
            ]);
        });

        it("sets it again when the URL unsets it and the studies are loaded", async () => {
            const unset = setPreventionDisease(undefined);
            const loaded = fetchResistanceStatusTypeStudiesSuccess([createPreventionStudyOf(MALARIA)]);

            expect(await initialDiseaseAfter([loaded, unset], unset)).toEqual([setPreventionDisease(MALARIA)]);
        });
    });

    describe("resetPreventionFiltersOnDiseaseSwitchEpic", () => {
        const actionsAfterDiseases = (diseases: ReadonlyArray<string>, loaded: ReadonlyArray<AnyAction>) => {
            const diseaseActions = diseases.map(disease => setPreventionDisease(disease));
            const state = createStateAfter([...loaded, ...diseaseActions]);
            return runEpic(resetPreventionFiltersOnDiseaseSwitchEpic, diseaseActions, state);
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

    // With a disease other than the default, the filters of the new map replace a class, mechanism or proxy
    // type they do not offer (filterValues.spec, diseaseMapBehaviour.spec), so the map change sets what it
    // set before the disease filter, whatever the disease.
    describe("setPreventionMapTypeEpic, the class and the mechanism of a map change", () => {
        const classAndMechanismAfterMapChange = async (
            mapType: PreventionMapType,
            before: ReadonlyArray<AnyAction>
        ) => {
            const toMap = setPreventionMapType(mapType);
            const actions = await runEpic(setPreventionMapTypeEpic, [toMap], createStateAfter([...before, toMap]));
            return actions.filter(action => classAndMechanismActions.includes(action.type));
        };

        const mechanismStudies = fetchResistanceMechanismTypeStudiesSuccess([
            mechanismStudy(MALARIA, MONO_OXYGENASES),
            mechanismStudy(DENGUE, GSTS),
        ]);

        it.each([
            ["malaria", MALARIA],
            ["dengue", DENGUE],
            ["no disease", undefined],
        ])("sets the default mechanism on Resistance mechanisms with %s", async (_case, disease) => {
            const before = [mechanismStudies, setPreventionDisease(disease)];

            expect(await classAndMechanismAfterMapChange(PreventionMapType.RESISTANCE_MECHANISM, before)).toEqual([
                setType([MONO_OXYGENASES]),
            ]);
        });

        it("leaves a class the new map does not offer to the class filter of that map", async () => {
            const before = [
                fetchResistanceStatusTypeStudiesSuccess([classStudy(DENGUE, ORGANOPHOSPHATES)]),
                setPreventionDisease(DENGUE),
                setInsecticideClass(CARBAMATES),
            ];

            expect(await classAndMechanismAfterMapChange(PreventionMapType.RESISTANCE_STATUS, before)).toEqual([
                setType(undefined),
            ]);
        });

        it("sets the default proxy type on Level of involvement, whatever the disease", async () => {
            const before = [
                fetchSynergistEffectTypeStudiesSuccess([involvementStudy(DENGUE, ESTERASES)]),
                setPreventionDisease(DENGUE),
            ];

            expect(await classAndMechanismAfterMapChange(PreventionMapType.LEVEL_OF_INVOLVEMENT, before)).toEqual([
                setProxyType(MONO_OXYGENASES),
            ]);
        });
    });
});

// A malaria study of the default year and a dengue study of an earlier year, so each disease has its own range.
const studiesOfTwoRanges = fetchResistanceStatusTypeStudiesSuccess([
    createPreventionStudyOf(MALARIA),
    createPreventionStudyOf(DENGUE, { YEAR_START: YEAR_BEFORE_RANGE, YEAR_END: YEAR_BEFORE_RANGE }),
]);

// The prevention map shows the malaria range, as when its studies load with malaria selected.
const mapShowingMalariaYears = [
    setThemeAction(PREVENTION_THEME),
    studiesOfTwoRanges,
    setMaxMinYearsAction([...STUDY_YEAR_RANGE]),
    setFiltersAction([...STUDY_YEAR_RANGE]),
];

describe("the year range of the chosen disease", () => {
    it("moves to the range of the new disease on a switch", async () => {
        const toDengue = setPreventionDisease(DENGUE);
        const state = createStateAfter([...mapShowingMalariaYears, setPreventionDisease(MALARIA), toDengue]);

        expect(await runEpic(setPreventionYearRangeOfDiseaseEpic, [toDengue], state)).toEqual([
            setMaxMinYearsAction([YEAR_BEFORE_RANGE, CURRENT_YEAR]),
            setFiltersAction([REQUESTED_VIR_START_DATE, CURRENT_YEAR]),
        ]);
    });

    it("stays when malaria is set and the map already shows its range", async () => {
        const toMalaria = setPreventionDisease(MALARIA);
        const state = createStateAfter([...mapShowingMalariaYears, toMalaria]);

        expect(await runEpic(setPreventionYearRangeOfDiseaseEpic, [toMalaria], state)).toEqual([]);
    });

    it("starts the slider at the first year of the new disease when it is the first year the map selects", async () => {
        const dengueFromSelectedStart = fetchResistanceStatusTypeStudiesSuccess([
            createPreventionStudyOf(MALARIA),
            createPreventionStudyOf(DENGUE, {
                YEAR_START: REQUESTED_VIR_START_DATE,
                YEAR_END: REQUESTED_VIR_START_DATE,
            }),
        ]);
        const toDengue = setPreventionDisease(DENGUE);
        const state = createStateAfter([
            setThemeAction(PREVENTION_THEME),
            dengueFromSelectedStart,
            setMaxMinYearsAction([...STUDY_YEAR_RANGE]),
            setFiltersAction([REQUESTED_VIR_START_DATE, CURRENT_YEAR]),
            setPreventionDisease(MALARIA),
            toDengue,
        ]);

        expect(await runEpic(setPreventionYearRangeOfDiseaseEpic, [toDengue], state)).toEqual([
            setMaxMinYearsAction([REQUESTED_VIR_START_DATE, CURRENT_YEAR]),
            setFiltersAction([REQUESTED_VIR_START_DATE, CURRENT_YEAR]),
        ]);
    });

    it("comes from the studies of the chosen disease on a map change", async () => {
        const toStatusMap = setPreventionMapType(PreventionMapType.RESISTANCE_STATUS);
        const state = createStateAfter([...mapShowingMalariaYears, setPreventionDisease(DENGUE), toStatusMap]);

        const actions = await runEpic(setPreventionMapTypeEpic, [toStatusMap], state);

        expect(actions.filter(action => action.type === ActionTypeEnum.MalariaSetMaxMinYears)).toEqual([
            setMaxMinYearsAction([YEAR_BEFORE_RANGE, CURRENT_YEAR]),
        ]);
    });
});

// Opening Data Download empties the class, and the filter chain the filters below it, so no value of the
// disease chosen on the map reaches Data Download, which shows the studies of the default disease only and
// takes its years from them.
describe("setPreventionThemeEpic, opening Data Download", () => {
    it("takes its years from the malaria studies of the map type and empties the class", async () => {
        const state = createStateAfter([studiesOfTwoRanges, setPreventionDisease(DENGUE)]);

        expect(await runEpic(setPreventionThemeEpic, [setThemeAction("prevention", DOWNLOAD)], state)).toEqual([
            setMaxMinYearsAction([...STUDY_YEAR_RANGE]),
            setInsecticideClass(null),
        ]);
    });
});
