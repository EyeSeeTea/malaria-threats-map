import {
    createInvasiveStudy,
    INVASIVE_SITE_ID,
    STUDY_CITATION_LONG,
    STUDY_CITATION_URL,
    STUDY_INSTITUTE_CURATION,
    STUDY_INSTITUTION_CITY,
} from "../../../../../domain/entities/__fixtures__/studyFixtures";
import {
    DJIBOUTI,
    INVASIVE,
    LARVAL_SAMPLING,
    MORPHOLOGY,
    NATIVE,
    NOT_AVAILABLE,
    NOT_FOUND,
    NOT_REPORTED,
    STEPHENSI,
    STEPHENSI_TYPE_FORM,
} from "../../../../../domain/entities/__fixtures__/studyValues";
import { INVASIVE_THEME } from "../../../__fixtures__/filtersFixtures";
import { InvasiveStudy } from "../../../../../domain/entities/InvasiveStudy";
import { SiteSelection } from "../../../types";
import { createInvasiveSelectionData } from "../utils";

const OTHER_SITE_ID = "SITE_DJ_002";
const NOT_REPORTED_LABEL = "common.invasive.chart.vector_occurrance.not_reported";
const IMMATURE = "Immature";
const ADULTS = "Adults";
const HABITAT = "Water tank";
const FIRST = "first";
const SECOND = "second";
const INVASIVE_2019 = "invasive2019";
const NATIVE_2022 = "native2022";
const NATIVE_2021 = "native2021";
const NOT_FOUND_2023 = "notFound2023";
const STUDY = "study";
const JULY = "July";
const SEPTEMBER = "September";
const MARCH = "March";

const selection: SiteSelection = { ISO_2_CODE: DJIBOUTI.ISO2, SITE_ID: INVASIVE_SITE_ID, coordinates: [43.15, 11.59] };

/** An invasive study at the selected site, with xMART-like month names and stage. */
const invasiveStudy = (code: string, overrides: Partial<InvasiveStudy> = {}) =>
    createInvasiveStudy({
        Code: code,
        SITE_ID: INVASIVE_SITE_ID,
        MONTH_START: JULY,
        MONTH_END: SEPTEMBER,
        YEAR_START: 2020,
        YEAR_END: 2020,
        STAGE: IMMATURE,
        BREEDING_HABITAT: HABITAT,
        ...overrides,
    });

const selectionData = (studies: InvasiveStudy[]) => createInvasiveSelectionData(INVASIVE_THEME, selection, studies);

const firstRow = (overrides: Partial<InvasiveStudy>) => selectionData([invasiveStudy(STUDY, overrides)]).data[0];

describe("createInvasiveSelectionData", () => {
    describe("no data", () => {
        it("returns null without a selection", () => {
            expect(createInvasiveSelectionData(INVASIVE_THEME, null, [invasiveStudy(STUDY)])).toBe(null);
        });

        it("returns null when no study is on the selected site", () => {
            expect(selectionData([invasiveStudy(STUDY, { SITE_ID: OTHER_SITE_ID })])).toBe(null);
        });
    });

    it("builds the whole selection data of a site, leaving out the studies of other sites", () => {
        const studies = [
            invasiveStudy(FIRST),
            invasiveStudy("otherSite", { SITE_ID: OTHER_SITE_ID }),
            invasiveStudy(SECOND, {
                YEAR_START: 2019,
                YEAR_END: 2019,
                MONTH_START: MARCH,
                MONTH_END: MARCH,
                STAGE: ADULTS,
                TOT_STUDIES: 3,
                VILLAGE_FLAG: 1,
            }),
        ];

        expect(selectionData(studies)).toEqual({
            kind: "invasive",
            title: `${DJIBOUTI.COUNTRY_NAME}, ${DJIBOUTI.ISO2}`,
            data: [
                {
                    code: FIRST,
                    species: STEPHENSI_TYPE_FORM,
                    samplingPeriod: "utils.July 2020 to utils.Sept. 2020",
                    samplingMethod: LARVAL_SAMPLING,
                    speciedIdentificationMethod: MORPHOLOGY,
                    vectorStage: IMMATURE,
                    sumOfTests: "1",
                    larvalHabitat: HABITAT,
                    villageOrigin: NOT_REPORTED_LABEL,
                },
                {
                    code: SECOND,
                    species: STEPHENSI_TYPE_FORM,
                    samplingPeriod: "utils.Mar. 2019",
                    samplingMethod: LARVAL_SAMPLING,
                    speciedIdentificationMethod: MORPHOLOGY,
                    vectorStage: ADULTS,
                    sumOfTests: "3",
                    larvalHabitat: undefined,
                    villageOrigin: DJIBOUTI.COUNTRY_NAME,
                },
            ],
            dataSources: [
                {
                    key: "a",
                    url: STUDY_CITATION_URL,
                    text: `${STUDY_CITATION_LONG}, ${STUDY_INSTITUTION_CITY}`,
                },
            ],
            curations: [{ text: STUDY_INSTITUTE_CURATION, dataSources: ["a"] }],
        });
    });

    describe("order of the studies", () => {
        // Pins today's behaviour, pending a decision: the studies are ordered by status before year,
        // which may or may not be the wanted order.
        it("puts the invasive status first and the year second, so an older invasive study comes before a recent native one", () => {
            const studies = [
                invasiveStudy(NATIVE_2022, { YEAR_START: 2022, INVASIVE_STATUS: NATIVE }),
                invasiveStudy(INVASIVE_2019, { YEAR_START: 2019, INVASIVE_STATUS: INVASIVE }),
                invasiveStudy(NATIVE_2021, { YEAR_START: 2021, INVASIVE_STATUS: NATIVE }),
                invasiveStudy(NOT_FOUND_2023, { YEAR_START: 2023, INVASIVE_STATUS: NOT_FOUND }),
            ];

            expect(selectionData(studies).data.map(row => row.code)).toEqual([
                INVASIVE_2019,
                NATIVE_2022,
                NATIVE_2021,
                NOT_FOUND_2023,
            ]);
        });

        it("takes the title from the first study of that order", () => {
            const invasiveVillage = "Invasive village";
            const studies = [
                invasiveStudy("native", { INVASIVE_STATUS: NATIVE, VILLAGE_NAME: "Native village" }),
                invasiveStudy("invasive", { INVASIVE_STATUS: INVASIVE, VILLAGE_NAME: invasiveVillage }),
            ];

            expect(selectionData(studies).title).toBe(`${invasiveVillage}, ${DJIBOUTI.ISO2}`);
        });
    });

    describe("not reported values", () => {
        it.each([
            ["NR", NOT_REPORTED, NOT_REPORTED_LABEL],
            ["null", null, NOT_REPORTED_LABEL],
        ])("shows %s as not reported", (_case, value, expected) => {
            const row = firstRow({ SAMPLING_METHOD: value, ID_METHOD: value, STAGE: value });

            expect([row.samplingMethod, row.speciedIdentificationMethod, row.vectorStage]).toEqual([
                expected,
                expected,
                expected,
            ]);
        });

        // Pins today's behaviour, a possible bug pending a decision: NA and empty texts are shown as
        // they are, not as "not reported".
        it("keeps NA and an empty text as they are, because it checks null with lodash, not the app's isNull", () => {
            expect(
                [firstRow({ SAMPLING_METHOD: NOT_AVAILABLE }), firstRow({ SAMPLING_METHOD: "" })].map(
                    row => row.samplingMethod
                )
            ).toEqual([NOT_AVAILABLE, ""]);
        });

        it("leaves the number of tests undefined when it is null", () => {
            expect(firstRow({ TOT_STUDIES: null }).sumOfTests).toBe(undefined);
        });
    });

    describe("species", () => {
        it.each([
            ["the species", {}, STEPHENSI_TYPE_FORM],
            ["the complex when the species is NR", { VECTOR_SPECIES: NOT_REPORTED }, STEPHENSI],
            ["an empty text when both are empty", { VECTOR_SPECIES: null, VECTOR_SPECIES_COMPLEX: NOT_AVAILABLE }, ""],
        ])("shows %s", (_case, overrides, expected) => {
            expect(firstRow(overrides).species).toBe(expected);
        });
    });

    describe("larval habitat", () => {
        // Immature and Adults are in the whole selection data test.
        it.each(["Immatures (larvae or pupae)", "Immature and adults"])("is shown for the stage %s", stage => {
            expect(firstRow({ STAGE: stage }).larvalHabitat).toBe(HABITAT);
        });
    });

    describe("sampling period", () => {
        it.each([
            ["January", "utils.Jan."],
            ["February", "utils.Feb."],
            [MARCH, "utils.Mar."],
            ["April", "utils.Apr."],
            ["May", "utils.May"],
            ["June", "utils.June"],
            [JULY, "utils.July"],
            ["August", "utils.Aug."],
            [SEPTEMBER, "utils.Sept."],
            ["October", "utils.Oct."],
            ["November", "utils.Nov."],
            ["December", "utils.Dec."],
        ])("labels %s with the key %s", (month, key) => {
            expect(firstRow({ MONTH_START: month, MONTH_END: month }).samplingPeriod).toBe(`${key} 2020`);
        });

        it.each([
            ["both years", { YEAR_END: 2021 }, "utils.July 2020 to utils.Sept. 2021"],
            ["only the start year", { YEAR_END: null }, "utils.July 2020"],
            ["only the end year", { YEAR_START: null }, "utils.Sept. 2020"],
            ["the years without months", { MONTH_START: null, MONTH_END: null }, "2020"],
            ["no year", { YEAR_START: null, YEAR_END: null }, NOT_REPORTED_LABEL],
        ])("with %s", (_case, overrides, expected) => {
            expect(firstRow(overrides).samplingPeriod).toBe(expected);
        });
    });
});
