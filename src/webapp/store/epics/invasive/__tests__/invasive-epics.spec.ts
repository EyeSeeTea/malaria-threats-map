import { AnyAction } from "redux";
import {
    fetchInvasiveStudiesSuccess,
    setInvasiveDisease,
    setInvasiveVectorSpecies,
} from "../../../actions/invasive-actions";
import {
    resetInvasiveFiltersOnDiseaseSwitchEpic,
    setInitialInvasiveDiseaseEpic,
    setInvasiveThemeEpic,
    setInvasiveYearRangeOfDiseaseEpic,
} from "../invasive-epics";
import {
    createInvasiveStudyOf,
    CURRENT_YEAR,
    STUDY_YEAR_RANGE,
} from "../../../../../domain/entities/__fixtures__/studyFixtures";
import { DENGUE, MALARIA } from "../../../../../domain/entities/__fixtures__/studyValues";
import { createStateAfter } from "../../../__fixtures__/stateFixtures";
import { runEpic } from "../../../__fixtures__/epicFixtures";
import { setFiltersAction, setMaxMinYearsAction, setThemeAction } from "../../../actions/base-actions";
import { DOWNLOAD, INVASIVE_THEME, MAP, YEAR_BEFORE_RANGE } from "../../../__fixtures__/filtersFixtures";

describe("invasive disease epics", () => {
    describe("setInitialInvasiveDiseaseEpic", () => {
        const initialDiseaseAfter = (before: ReadonlyArray<AnyAction>, action: AnyAction) =>
            runEpic(setInitialInvasiveDiseaseEpic, [action], createStateAfter(before));

        it("sets malaria when the loaded studies carry malaria and another disease", async () => {
            const loaded = fetchInvasiveStudiesSuccess([createInvasiveStudyOf(DENGUE), createInvasiveStudyOf(MALARIA)]);

            expect(await initialDiseaseAfter([loaded], loaded)).toEqual([setInvasiveDisease(MALARIA)]);
        });

        it("sets nothing when the studies carry no disease", async () => {
            const loaded = fetchInvasiveStudiesSuccess([createInvasiveStudyOf(undefined)]);

            expect(await initialDiseaseAfter([loaded], loaded)).toEqual([]);
        });

        it("keeps the disease of the URL, set before the studies load, when the studies carry it", async () => {
            const loaded = fetchInvasiveStudiesSuccess([createInvasiveStudyOf(MALARIA), createInvasiveStudyOf(DENGUE)]);

            expect(await initialDiseaseAfter([setInvasiveDisease(DENGUE), loaded], loaded)).toEqual([]);
        });

        it("replaces a disease of the URL that the loaded studies do not carry", async () => {
            const loaded = fetchInvasiveStudiesSuccess([createInvasiveStudyOf(MALARIA)]);

            expect(await initialDiseaseAfter([setInvasiveDisease(DENGUE), loaded], loaded)).toEqual([
                setInvasiveDisease(MALARIA),
            ]);
        });
    });

    describe("resetInvasiveFiltersOnDiseaseSwitchEpic", () => {
        const actionsAfterDiseases = (diseases: ReadonlyArray<string | undefined>) =>
            runEpic(
                resetInvasiveFiltersOnDiseaseSwitchEpic,
                diseases.map(disease => setInvasiveDisease(disease))
            );

        it("empties nothing the first time the disease is set", async () => {
            expect(await actionsAfterDiseases([MALARIA])).toEqual([]);
        });

        it("empties the vector species on a switch", async () => {
            expect(await actionsAfterDiseases([MALARIA, DENGUE])).toEqual([setInvasiveVectorSpecies([])]);
        });

        it("empties nothing when the same disease is set again, nor when it is unset", async () => {
            expect(await actionsAfterDiseases([DENGUE, DENGUE, undefined])).toEqual([]);
        });
    });
});

const dengueYears = [YEAR_BEFORE_RANGE, CURRENT_YEAR];

// A malaria study of the default year and a dengue study of an earlier year, so each disease has its own range.
const studiesOfTwoRanges = fetchInvasiveStudiesSuccess([
    createInvasiveStudyOf(MALARIA),
    createInvasiveStudyOf(DENGUE, { YEAR_START: YEAR_BEFORE_RANGE, YEAR_END: YEAR_BEFORE_RANGE }),
]);

describe("the year range of the chosen disease", () => {
    // The invasive map shows the malaria range, as when its studies load with malaria selected.
    const mapShowingMalariaYears = [
        setThemeAction(INVASIVE_THEME),
        studiesOfTwoRanges,
        setMaxMinYearsAction([...STUDY_YEAR_RANGE]),
        setFiltersAction([...STUDY_YEAR_RANGE]),
    ];

    it("moves to the range of the new disease on a switch", async () => {
        const toDengue = setInvasiveDisease(DENGUE);
        const state = createStateAfter([...mapShowingMalariaYears, setInvasiveDisease(MALARIA), toDengue]);

        expect(await runEpic(setInvasiveYearRangeOfDiseaseEpic, [toDengue], state)).toEqual([
            setMaxMinYearsAction(dengueYears),
            setFiltersAction(dengueYears),
        ]);
    });

    it("stays when malaria is set and the map already shows its range", async () => {
        const toMalaria = setInvasiveDisease(MALARIA);
        const state = createStateAfter([...mapShowingMalariaYears, toMalaria]);

        expect(await runEpic(setInvasiveYearRangeOfDiseaseEpic, [toMalaria], state)).toEqual([]);
    });

    it("comes from the studies of the chosen disease when the map opens the theme", async () => {
        const state = createStateAfter([studiesOfTwoRanges, setInvasiveDisease(DENGUE)]);

        expect(await runEpic(setInvasiveThemeEpic, [setThemeAction("invasive", MAP)], state)).toEqual([
            setMaxMinYearsAction(dengueYears),
            setFiltersAction(dengueYears),
        ]);
    });
});

// Data Download shows the studies of the default disease only, whatever the map shows.
describe("setInvasiveThemeEpic, opening Data Download", () => {
    it("takes its years from the malaria studies", async () => {
        const state = createStateAfter([studiesOfTwoRanges, setInvasiveDisease(DENGUE)]);

        const actions = await runEpic(setInvasiveThemeEpic, [setThemeAction("invasive", DOWNLOAD)], state);

        expect(actions).toEqual([setMaxMinYearsAction([...STUDY_YEAR_RANGE]), setFiltersAction([...STUDY_YEAR_RANGE])]);
    });
});
