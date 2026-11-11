import { createInvasiveStudy } from "../../../../../domain/entities/__fixtures__/studyFixtures";
import {
    NOT_AVAILABLE,
    NOT_REPORTED,
    STEPHENSI,
    STEPHENSI_TYPE_FORM,
} from "../../../../../domain/entities/__fixtures__/studyValues";
import { InvasiveStudy } from "../../../../../domain/entities/InvasiveStudy";
import { SiteSelection } from "../../../types";
import { createInvasiveSelectionData } from "../utils";

const INVASIVE = "invasive";
const SITE_ID = "SITE_DJ_001";
const OTHER_SITE_ID = "SITE_DJ_002";
const NOT_REPORTED_LABEL = "common.invasive.chart.vector_occurrance.not_reported";
const IMMATURE = "Immature";
const ADULTS = "Adults";
const HABITAT = "Water tank";
const VILLAGE = "Djibouti";
const STATUS_INVASIVE = "Invasive";
const STATUS_NATIVE = "Native";
const STATUS_NOT_FOUND = "Not found";
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
const SAMPLING_METHOD = "LARVAL_SAMPLING";
const ID_METHOD = "MORPHOLOGY";

const selection: SiteSelection = { ISO_2_CODE: "DJ", SITE_ID, coordinates: [43.15, 11.59] };

/** An invasive study at the selected site, with xMART-like month names and stage. */
const invasiveStudy = (code: string, overrides: Partial<InvasiveStudy> = {}) =>
    createInvasiveStudy({
        Code: code,
        SITE_ID,
        MONTH_START: JULY,
        MONTH_END: SEPTEMBER,
        YEAR_START: 2020,
        YEAR_END: 2020,
        STAGE: IMMATURE,
        BREEDING_HABITAT: HABITAT,
        ...overrides,
    });

const selectionData = (studies: InvasiveStudy[]) => createInvasiveSelectionData(INVASIVE, selection, studies);

const firstRow = (overrides: Partial<InvasiveStudy>) => selectionData([invasiveStudy(STUDY, overrides)]).data[0];

describe("createInvasiveSelectionData", () => {
    describe("no data", () => {
        it("returns null without a selection", () => {
            expect(createInvasiveSelectionData(INVASIVE, null, [invasiveStudy(STUDY)])).toBe(null);
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
            title: "Djibouti, DJ",
            data: [
                {
                    code: FIRST,
                    species: STEPHENSI_TYPE_FORM,
                    samplingPeriod: "utils.July 2020 to utils.Sept. 2020",
                    samplingMethod: SAMPLING_METHOD,
                    speciedIdentificationMethod: ID_METHOD,
                    vectorStage: IMMATURE,
                    sumOfTests: "1",
                    larvalHabitat: HABITAT,
                    villageOrigin: NOT_REPORTED_LABEL,
                },
                {
                    code: SECOND,
                    species: STEPHENSI_TYPE_FORM,
                    samplingPeriod: "utils.Mar. 2019",
                    samplingMethod: SAMPLING_METHOD,
                    speciedIdentificationMethod: ID_METHOD,
                    vectorStage: ADULTS,
                    sumOfTests: "3",
                    larvalHabitat: undefined,
                    villageOrigin: VILLAGE,
                },
            ],
            dataSources: [
                { key: "a", url: "https://example.org/citation", text: "Example citation, long form, Ouagadougou" },
            ],
            curations: [{ text: "Example curation institute", dataSources: ["a"] }],
        });
    });

    describe("order of the studies", () => {
        // Pins today's behaviour, pending a decision: the studies are ordered by status before year,
        // which may or may not be the wanted order.
        it("puts the invasive status first and the year second, so an older invasive study comes before a recent native one", () => {
            const studies = [
                invasiveStudy(NATIVE_2022, { YEAR_START: 2022, INVASIVE_STATUS: STATUS_NATIVE }),
                invasiveStudy(INVASIVE_2019, { YEAR_START: 2019, INVASIVE_STATUS: STATUS_INVASIVE }),
                invasiveStudy(NATIVE_2021, { YEAR_START: 2021, INVASIVE_STATUS: STATUS_NATIVE }),
                invasiveStudy(NOT_FOUND_2023, { YEAR_START: 2023, INVASIVE_STATUS: STATUS_NOT_FOUND }),
            ];

            expect(selectionData(studies).data.map(row => row.code)).toEqual([
                INVASIVE_2019,
                NATIVE_2022,
                NATIVE_2021,
                NOT_FOUND_2023,
            ]);
        });

        it("takes the title from the first study of that order", () => {
            const studies = [
                invasiveStudy("native", { INVASIVE_STATUS: STATUS_NATIVE, VILLAGE_NAME: "Native village" }),
                invasiveStudy("invasive", { INVASIVE_STATUS: STATUS_INVASIVE, VILLAGE_NAME: "Invasive village" }),
            ];

            expect(selectionData(studies).title).toBe("Invasive village, DJ");
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

        it("shows the village of origin only when its flag is set", () => {
            expect(
                [firstRow({ VILLAGE_FLAG: 1 }), firstRow({ VILLAGE_FLAG: 0 })].map(row => row.villageOrigin)
            ).toEqual([VILLAGE, NOT_REPORTED_LABEL]);
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
        it.each(["Immatures (larvae or pupae)", IMMATURE, "Immature and adults"])(
            "is shown for the stage %s",
            stage => {
                expect(firstRow({ STAGE: stage }).larvalHabitat).toBe(HABITAT);
            }
        );

        it("is not shown for adults", () => {
            expect(firstRow({ STAGE: ADULTS }).larvalHabitat).toBe(undefined);
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
