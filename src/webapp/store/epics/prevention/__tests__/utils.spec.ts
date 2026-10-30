import { createPreventionStudy } from "../../../../../domain/entities/__fixtures__/studyFixtures";
import {
    DELTAMETHRIN,
    DISCRIMINATING,
    ESTERASES,
    FUNESTUS,
    GAMBIAE,
    INTENSITY,
    KDR_L1014F,
    MOLECULAR,
    MONO_OXYGENASES,
    NOT_AVAILABLE,
    NOT_REPORTED,
    ORGANOPHOSPHATES,
    PERMETHRIN,
    SYNERGIST,
    WHO_TEST_KIT,
    CDC_BOTTLE,
    ACE1R,
} from "../../../../../domain/entities/__fixtures__/studyValues";
import { PreventionStudy } from "../../../../../domain/entities/PreventionStudy";
import { Option } from "../../../../components/BasicSelect";
import { PreventionChartDataItem, SelectionData } from "../../../SelectionData";
import { PreventionMapType, SiteSelection } from "../../../types";
import { createPreventionSelectionData } from "../utils";

const PREVENTION = "prevention";
const SITE_ID = "SITE_BF_001";
const OTHER_SITE_ID = "SITE_BF_002";
const TITLE = "Bobo-Dioulasso, BF";
const CONC = "0.05%";
const CONFIRMED = "CONFIRMED_RESISTANCE";
const POSSIBLE = "POSSIBLE_RESISTANCE";
const SUSCEPTIBLE = "SUSCEPTIBLE";
const UNDETERMINED = "UNDETERMINED";
const DETECTED = "DETECTED";
const NOT_DETECTED = "NOT_DETECTED";
const FULL = "FULL_INVOLVEMENT";
const PARTIAL = "PARTIAL_INVOLVEMENT";
const NO_SYNERGIST = "NO";
const PBO = "PBO";
const PBO_CONC = "4%";
const NO_SYNERGIST_LABEL = "common.prevention.chart.synergist_involvement.no_synergist";
const OTHER_CLASS_TITLE = "common.prevention.chart.other_insecticide_class_label";
const OTHER_MECHANISMS_TITLE = "common.prevention.chart.other_mechanisms";
const NOT_REPORTED_LABEL = "common.prevention.chart.resistance_mechanism.not_reported";
const LIGHT_GREY = "#D0CECE";
const OLDER = "older";
const RECENT = "recent";
const OTHER_CLASS = "otherClass";
const OTHER_SITE = "otherSite";
const STUDY = "study";
const ESTERASES_STUDY = "esterases";
const FULL_STUDY = "full";
const OBJECT_THREE = "objectThree";
const WITHOUT_P2 = "withoutP2";
const SYNERGIST_P1 = "synergistP1";
const SYNERGIST_P2 = "synergistP2";
const FUNESTUS_STUDY = "funestus";
const PAIR_1 = "P1";
const PAIR_2 = "P2";
const CONFIRMED_COLOR = "#D43501";
const POSSIBLE_COLOR = "#FF9502";
const NA_LABEL = "N/A";
const DARK_GREY = "#717171";

const SOURCE_A = { key: "a", url: "https://example.org/citation", text: "Example citation, long form, Ouagadougou" };
const CURATION_A = { text: "Example curation institute", dataSources: ["a"] };
const GAMBIAE_OPTION: Option = { label: GAMBIAE, value: GAMBIAE };
const FUNESTUS_OPTION: Option = { label: FUNESTUS, value: FUNESTUS };

const selection: SiteSelection = { ISO_2_CODE: "BF", SITE_ID, coordinates: [-4.3, 11.18] };

const study = (code: string, overrides: Partial<PreventionStudy> = {}) =>
    createPreventionStudy({ Code: code, SITE_ID, ...overrides });

const selectionData = (
    mapType: PreventionMapType,
    filteredStudies: PreventionStudy[],
    nonFilteredStudies: PreventionStudy[] = filteredStudies,
    speciesFilter?: Option[]
) => createPreventionSelectionData(PREVENTION, mapType, selection, filteredStudies, nonFilteredStudies, speciesFilter);

/** The chart series of a prevention map type, for one species and test type. */
function seriesOf(data: SelectionData, species = GAMBIAE, type = WHO_TEST_KIT): PreventionChartDataItem[] {
    if (data.kind !== "common" || data.data?.kind !== "prevention") return [];
    return data.data.data[species][type].seriesData;
}

function chartKeys(data: SelectionData): Record<string, string[]> {
    if (data.kind !== "common" || (data.data?.kind !== "prevention" && data.data?.kind !== "prevention-mechanism"))
        return {};
    return Object.fromEntries(
        Object.entries(data.data.data).map(([species, byType]) => [species, Object.keys(byType)])
    );
}

const item = (overrides: Partial<PreventionChartDataItem>) => ({
    number: "100",
    resistanceStatus: POSSIBLE,
    ...overrides,
});

describe("createPreventionSelectionData", () => {
    describe("no data", () => {
        it("returns null without a selection", () => {
            const studies = [study(STUDY)];

            expect(
                createPreventionSelectionData(PREVENTION, PreventionMapType.RESISTANCE_STATUS, null, studies, studies)
            ).toBe(null);
        });

        it("returns null when no filtered study is on the selected site", () => {
            const studies = [study(STUDY, { SITE_ID: OTHER_SITE_ID })];

            expect(selectionData(PreventionMapType.RESISTANCE_STATUS, studies)).toBe(null);
        });
    });

    describe("Resistance status", () => {
        const mapType = PreventionMapType.RESISTANCE_STATUS;

        it("builds the whole selection data of a site", () => {
            const older = study(OLDER);
            const recent = study(RECENT, {
                YEAR_START: 2021,
                INSECTICIDE_TYPE: PERMETHRIN,
                MORTALITY_ADJUSTED: "0.5",
                RESISTANCE_STATUS: CONFIRMED,
            });
            const filtered = [older, recent, study(OTHER_SITE, { SITE_ID: OTHER_SITE_ID })];
            const otherClass = study(OTHER_CLASS, {
                INSECTICIDE_CLASS: ORGANOPHOSPHATES,
                RESISTANCE_STATUS: CONFIRMED,
            });

            expect(selectionData(mapType, filtered, [...filtered, otherClass])).toEqual({
                kind: "common",
                title: TITLE,
                subtitle: DISCRIMINATING,
                filterOptions: [GAMBIAE_OPTION],
                filterSelection: [GAMBIAE_OPTION],
                studyObject: recent,
                data: {
                    kind: "prevention",
                    data: {
                        [GAMBIAE]: {
                            [WHO_TEST_KIT]: {
                                title: undefined,
                                seriesData: [
                                    item({
                                        name: `2020, ${DELTAMETHRIN} ${CONC} - 85% (a) `,
                                        y: 85,
                                        color: POSSIBLE_COLOR,
                                        group: "2020",
                                    }),
                                    item({
                                        name: `2021, ${PERMETHRIN} ${CONC} - 50% (a) `,
                                        y: 50,
                                        resistanceStatus: CONFIRMED,
                                        color: CONFIRMED_COLOR,
                                        group: "2021",
                                    }),
                                ],
                            },
                        },
                    },
                },
                dataSources: [SOURCE_A],
                curations: [CURATION_A],
                othersTitle: OTHER_CLASS_TITLE,
                othersDetected: [ORGANOPHOSPHATES],
            });
        });

        it("takes the studies of a site in order of year, the most recent first, for the title and the study object", () => {
            const recent = study(RECENT, { YEAR_START: 2022, VILLAGE_NAME: "Recent village" });
            const data = selectionData(mapType, [study(OLDER), recent]);

            expect(data.kind === "common" && [data.title, data.studyObject]).toEqual(["Recent village, BF", recent]);
        });

        it("groups the chart by species, sorted, then by test type", () => {
            const studies = [
                study(FUNESTUS_STUDY, { SPECIES: FUNESTUS }),
                study("gambiaeWho"),
                study("gambiaeCdc", { TYPE: CDC_BOTTLE }),
            ];

            expect(chartKeys(selectionData(mapType, studies))).toEqual({
                [FUNESTUS]: [WHO_TEST_KIT],
                [GAMBIAE]: [WHO_TEST_KIT, CDC_BOTTLE],
            });
        });

        it("joins the studies with the same year, insecticide, concentration and mortality into one bar, the most resistant", () => {
            const studies = [
                study("susceptible", { RESISTANCE_STATUS: SUSCEPTIBLE, CITATION_URL: NOT_AVAILABLE }),
                study("confirmed", { RESISTANCE_STATUS: CONFIRMED }),
            ];

            expect(seriesOf(selectionData(mapType, studies))).toEqual([
                item({
                    name: `2020, ${DELTAMETHRIN} ${CONC} - 85% (a, b) `,
                    y: 85,
                    resistanceStatus: CONFIRMED,
                    color: CONFIRMED_COLOR,
                    group: "2020",
                }),
            ]);
        });

        it("orders the bars by year, insecticide and mortality", () => {
            const studies = [
                study("permethrin", { INSECTICIDE_TYPE: PERMETHRIN }),
                study("highMortality", { MORTALITY_ADJUSTED: "0.9" }),
                study("lowMortality", { MORTALITY_ADJUSTED: "0.1" }),
                study(OLDER, { YEAR_START: 2019 }),
            ];

            expect(seriesOf(selectionData(mapType, studies)).map(bar => bar.name)).toEqual([
                `2019, ${DELTAMETHRIN} ${CONC} - 85% (a) `,
                `2020, ${DELTAMETHRIN} ${CONC} - 10% (a) `,
                `2020, ${DELTAMETHRIN} ${CONC} - 90% (a) `,
                `2020, ${PERMETHRIN} ${CONC} - 85% (a) `,
            ]);
        });

        it.each([
            [CONFIRMED, CONFIRMED_COLOR],
            [POSSIBLE, POSSIBLE_COLOR],
            [SUSCEPTIBLE, "#869C66"],
            [UNDETERMINED, "#BEBEBE"],
            [NOT_AVAILABLE, undefined],
        ])("colours a %s bar %s", (status, color) => {
            const bars = seriesOf(selectionData(mapType, [study(STUDY, { RESISTANCE_STATUS: status })]));

            expect(bars.map(bar => bar.color)).toEqual([color]);
        });
    });

    describe("Intensity status", () => {
        const mapType = PreventionMapType.INTENSITY_STATUS;
        const intensityStudy = (code: string, overrides: Partial<PreventionStudy> = {}) =>
            study(code, { ASSAY_TYPE: INTENSITY, ...overrides });

        it("builds the whole selection data of a site", () => {
            const fivefold = intensityStudy("fivefold", { INSECTICIDE_INTENSITY: 5, MORTALITY_ADJUSTED: "1" });
            const studies = [fivefold, intensityStudy("onefold")];
            const otherClass = intensityStudy(OTHER_CLASS, {
                INSECTICIDE_CLASS: ORGANOPHOSPHATES,
                RESISTANCE_STATUS: CONFIRMED,
            });

            expect(selectionData(mapType, studies, [...studies, otherClass])).toEqual({
                kind: "common",
                title: TITLE,
                subtitle: INTENSITY,
                filterOptions: [GAMBIAE_OPTION],
                filterSelection: [GAMBIAE_OPTION],
                studyObject: fivefold,
                data: {
                    kind: "prevention",
                    data: {
                        [GAMBIAE]: {
                            [WHO_TEST_KIT]: {
                                title: undefined,
                                seriesData: [
                                    item({
                                        name: `2020, 1x ${DELTAMETHRIN} (a) `,
                                        y: 85,
                                        color: LIGHT_GREY,
                                        group: `2020_${DELTAMETHRIN}`,
                                    }),
                                    item({
                                        name: `2020, 5x ${DELTAMETHRIN} (a) `,
                                        y: 100,
                                        color: DARK_GREY,
                                        group: `2020_${DELTAMETHRIN}`,
                                    }),
                                ],
                            },
                        },
                    },
                },
                dataSources: [SOURCE_A],
                curations: [CURATION_A],
                othersTitle: OTHER_CLASS_TITLE,
                othersDetected: [ORGANOPHOSPHATES],
            });
        });

        it("joins the studies with the same year, intensity and insecticide into one bar, the highest mortality", () => {
            const studies = [
                intensityStudy("low", { MORTALITY_ADJUSTED: "0.6" }),
                intensityStudy("high", { MORTALITY_ADJUSTED: "0.95" }),
            ];

            expect(seriesOf(selectionData(mapType, studies)).map(bar => bar.y)).toEqual([95]);
        });

        it.each([
            ["0.999", LIGHT_GREY],
            ["1", DARK_GREY],
        ])("colours a bar with mortality %s as %s, the threshold being 100%", (mortality, color) => {
            const bars = seriesOf(selectionData(mapType, [intensityStudy(STUDY, { MORTALITY_ADJUSTED: mortality })]));

            expect(bars.map(bar => bar.color)).toEqual([color]);
        });
    });

    describe("Level of involvement", () => {
        const mapType = PreventionMapType.LEVEL_OF_INVOLVEMENT;
        const involvementStudy = (code: string, overrides: Partial<PreventionStudy> = {}) =>
            study(code, {
                ASSAY_TYPE: SYNERGIST,
                PROXY_TYPE: MONO_OXYGENASES,
                MECHANISM_PROXY: FULL,
                SYNERGIST_TYPE: NO_SYNERGIST,
                STUDY_PAIRING_CODE: PAIR_1,
                ...overrides,
            });
        const synergistStudy = (code: string, overrides: Partial<PreventionStudy> = {}) =>
            involvementStudy(code, { SYNERGIST_TYPE: PBO, SYNERGIST_CONC: PBO_CONC, ...overrides });

        const NO_SYNERGIST_NAME = `2020, ${DELTAMETHRIN} ${CONC}, ${NO_SYNERGIST_LABEL} (a) `;
        const PBO_NAME = `2020, ${DELTAMETHRIN} ${CONC}, ${PBO} ${PBO_CONC} (a) `;

        // Each study of these tests has its own mortality, so the bar's value tells which study it shows.
        const barCodes = (studies: PreventionStudy[]) =>
            seriesOf(selectionData(mapType, studies)).map(
                bar => studies.find(s => Math.round(parseFloat(s.MORTALITY_ADJUSTED) * 100) === bar.y)?.Code
            );

        it("builds the whole selection data of a site, with no others", () => {
            const withoutSynergist = involvementStudy("withoutSynergist", { MORTALITY_ADJUSTED: "0.4", OBJECTID: 1 });
            const withSynergist = synergistStudy("withSynergist", { MORTALITY_ADJUSTED: "0.95", OBJECTID: 2 });
            const studies = [withoutSynergist, withSynergist];
            const otherClass = involvementStudy(OTHER_CLASS, {
                INSECTICIDE_CLASS: ORGANOPHOSPHATES,
                RESISTANCE_STATUS: CONFIRMED,
            });

            expect(selectionData(mapType, studies, [...studies, otherClass])).toEqual({
                kind: "common",
                title: TITLE,
                subtitle: SYNERGIST,
                filterOptions: [GAMBIAE_OPTION],
                filterSelection: [GAMBIAE_OPTION],
                studyObject: withoutSynergist,
                data: {
                    kind: "prevention",
                    data: {
                        [GAMBIAE]: {
                            [WHO_TEST_KIT]: {
                                title: undefined,
                                seriesData: [
                                    item({
                                        name: NO_SYNERGIST_NAME,
                                        y: 40,
                                        color: LIGHT_GREY,
                                        group: `2020_${DELTAMETHRIN}`,
                                    }),
                                    item({ name: PBO_NAME, y: 95, color: DARK_GREY, group: `2020_${DELTAMETHRIN}` }),
                                ],
                            },
                        },
                    },
                },
                dataSources: [SOURCE_A],
                curations: [CURATION_A],
                othersTitle: "",
                othersDetected: [],
            });
        });

        describe("first study of each group", () => {
            it("keeps only the studies with the top level of involvement of each bar", () => {
                const studies = [
                    involvementStudy("partial", { MECHANISM_PROXY: PARTIAL, MORTALITY_ADJUSTED: "0.3" }),
                    involvementStudy(FULL_STUDY, { MORTALITY_ADJUSTED: "0.6" }),
                ];

                expect(barCodes(studies)).toEqual([FULL_STUDY]);
            });

            it("picks the study with the lowest OBJECTID when several share a bar", () => {
                const studies = [
                    involvementStudy("objectFive", { OBJECTID: 5 }),
                    involvementStudy(OBJECT_THREE, { OBJECTID: 3, MORTALITY_ADJUSTED: "0.3" }),
                ];

                expect(barCodes(studies)).toEqual([OBJECT_THREE]);
            });

            it("pairs the bars by the first pairing code that has a study with and without synergist", () => {
                const studies = [
                    synergistStudy(SYNERGIST_P1, { STUDY_PAIRING_CODE: PAIR_1, MORTALITY_ADJUSTED: "0.91" }),
                    involvementStudy(WITHOUT_P2, { STUDY_PAIRING_CODE: PAIR_2, MORTALITY_ADJUSTED: "0.2" }),
                    synergistStudy(SYNERGIST_P2, { STUDY_PAIRING_CODE: PAIR_2, MORTALITY_ADJUSTED: "0.92" }),
                ];

                expect(barCodes(studies)).toEqual([WITHOUT_P2, SYNERGIST_P2]);
            });

            it("falls back to any study without synergist when no pairing code is shared", () => {
                const studies = [
                    synergistStudy(SYNERGIST_P1, { STUDY_PAIRING_CODE: PAIR_1, MORTALITY_ADJUSTED: "0.91" }),
                    involvementStudy(WITHOUT_P2, { STUDY_PAIRING_CODE: PAIR_2, MORTALITY_ADJUSTED: "0.2" }),
                ];

                expect(barCodes(studies)).toEqual([WITHOUT_P2, SYNERGIST_P1]);
            });

            it("shows only the study without synergist when there is no synergist study", () => {
                const studies = [involvementStudy("without", { MORTALITY_ADJUSTED: "0.2" })];

                expect(seriesOf(selectionData(mapType, studies)).map(bar => bar.name)).toEqual([
                    `2020, ${DELTAMETHRIN} ${CONC}, ${NO_SYNERGIST_LABEL} (a) `,
                ]);
            });
        });

        it.each([
            ["0.899", LIGHT_GREY],
            ["0.9", DARK_GREY],
        ])("colours a bar with mortality %s as %s, the threshold being 90%", (mortality, color) => {
            const bars = seriesOf(selectionData(mapType, [involvementStudy(STUDY, { MORTALITY_ADJUSTED: mortality })]));

            expect(bars.map(bar => bar.color)).toEqual([color]);
        });
    });

    describe("Resistance mechanisms", () => {
        const mapType = PreventionMapType.RESISTANCE_MECHANISM;
        const mechanismStudy = (code: string, overrides: Partial<PreventionStudy> = {}) =>
            study(code, {
                ASSAY_TYPE: MOLECULAR,
                TYPE: KDR_L1014F,
                MECHANISM_STATUS: DETECTED,
                MECHANISM_FREQUENCY: "45",
                ...overrides,
            });

        it("builds the whole selection data of a site, with a column per year between the first and the last", () => {
            const recent = mechanismStudy(RECENT, {
                MECHANISM_STATUS: NOT_DETECTED,
                MECHANISM_FREQUENCY: NOT_REPORTED,
            });
            const older = mechanismStudy(OLDER, { YEAR_START: 2018 });
            const studies = [recent, older];
            const others = [
                mechanismStudy(ESTERASES_STUDY, { TYPE: ESTERASES }),
                mechanismStudy("ace1rNotDetected", { TYPE: ACE1R, MECHANISM_STATUS: NOT_DETECTED }),
                mechanismStudy("unknownMechanism", { TYPE: "CYP6P3" }),
            ];

            expect(selectionData(mapType, studies, [...studies, ...others])).toEqual({
                kind: "common",
                title: TITLE,
                subtitle: MOLECULAR,
                filterOptions: [GAMBIAE_OPTION],
                filterSelection: [GAMBIAE_OPTION],
                studyObject: recent,
                data: {
                    kind: "prevention-mechanism",
                    data: {
                        [GAMBIAE]: {
                            [KDR_L1014F]: {
                                years: [2018, 2019, 2020],
                                assays: [
                                    {
                                        maxPointWidth: 20,
                                        name: "common.prevention.chart.resistance_mechanism.DETECTED",
                                        color: "#d43501",
                                        data: [
                                            { name: "2018 (a) ", y: -1, yName: "1" },
                                            { name: "2019  ", y: -0.1, yName: "0" },
                                            { name: "2020 (a) ", y: -0.1, yName: "0" },
                                        ],
                                    },
                                    {
                                        maxPointWidth: 20,
                                        name: "common.prevention.chart.resistance_mechanism.NOT_DETECTED",
                                        color: "#ff9502",
                                        data: [
                                            { name: "2018 (a) ", y: 0, yName: "0" },
                                            { name: "2019  ", y: 0, yName: "0" },
                                            { name: "2020 (a) ", y: 1, yName: "1" },
                                        ],
                                    },
                                ],
                                allelics: [
                                    {
                                        maxPointWidth: 20,
                                        name: GAMBIAE,
                                        color: "#2D9BF0",
                                        data: [
                                            { name: "2018", y: 45, yName: "45", value: "45%" },
                                            { name: "2019", y: 0, yName: "0", value: NOT_REPORTED_LABEL },
                                            { name: "2020", y: 0, yName: "0", value: NOT_REPORTED_LABEL },
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                },
                dataSources: [SOURCE_A],
                curations: [CURATION_A],
                othersTitle: OTHER_MECHANISMS_TITLE,
                othersDetected: [`TYPE.${ESTERASES}`],
            });
        });

        describe("assay groups", () => {
            const assaysOf = (data: SelectionData) =>
                data.kind === "common" && data.data?.kind === "prevention-mechanism"
                    ? data.data.data[GAMBIAE][KDR_L1014F].assays.map(group => group.data.map(point => point.yName))
                    : [];

            it("counts as not detected every status that is not DETECTED, NA included", () => {
                const studies = [
                    mechanismStudy("detected"),
                    mechanismStudy("notDetected", { MECHANISM_STATUS: NOT_DETECTED }),
                    mechanismStudy("na", { MECHANISM_STATUS: NOT_AVAILABLE }),
                ];

                expect(assaysOf(selectionData(mapType, studies))).toEqual([["1"], ["2"]]);
            });
        });

        describe("allelic frequencies", () => {
            const allelicsOf = (studies: PreventionStudy[]) => {
                const data = selectionData(mapType, studies);
                return data.kind === "common" && data.data?.kind === "prevention-mechanism"
                    ? data.data.data[GAMBIAE][KDR_L1014F].allelics[0].data.map(point => [point.y, point.value])
                    : [];
            };

            it.each([
                ["a number", "12.5", [12.5, "12.5%"]],
                ["NA", NOT_AVAILABLE, [0, NA_LABEL]],
                ["null as NaN (finding)", null, [NaN, NA_LABEL]],
                ["NR", NOT_REPORTED, [0, NOT_REPORTED_LABEL]],
            ])("shows %s", (_case, frequency, expected) => {
                expect(allelicsOf([mechanismStudy(STUDY, { MECHANISM_FREQUENCY: frequency })])).toEqual([expected]);
            });

            it("shows only the first study of a year, the others of that year are left out (finding)", () => {
                const studies = [
                    mechanismStudy("first", { MECHANISM_FREQUENCY: "10" }),
                    mechanismStudy("second", { MECHANISM_FREQUENCY: "90" }),
                ];

                expect(allelicsOf(studies)).toEqual([[10, "10%"]]);
            });
        });
    });

    describe("species filter", () => {
        const mapType = PreventionMapType.RESISTANCE_STATUS;
        const studies = [study("gambiae"), study(FUNESTUS_STUDY, { SPECIES: FUNESTUS })];

        const filterAndChart = (speciesFilter?: Option[]) => {
            const data = selectionData(mapType, studies, studies, speciesFilter);
            return data.kind === "common" && [data.filterOptions, data.filterSelection, Object.keys(chartKeys(data))];
        };

        it("offers the species of the site sorted, and selects them all without a filter", () => {
            expect(filterAndChart()).toEqual([
                [FUNESTUS_OPTION, GAMBIAE_OPTION],
                [FUNESTUS_OPTION, GAMBIAE_OPTION],
                [FUNESTUS, GAMBIAE],
            ]);
        });

        it("charts only the species of the filter, and keeps every species as an option", () => {
            expect(filterAndChart([GAMBIAE_OPTION])).toEqual([
                [FUNESTUS_OPTION, GAMBIAE_OPTION],
                [GAMBIAE_OPTION],
                [GAMBIAE],
            ]);
        });

        it("charts every species with an empty filter, but selects none", () => {
            expect(filterAndChart([])).toEqual([[FUNESTUS_OPTION, GAMBIAE_OPTION], [], [FUNESTUS, GAMBIAE]]);
        });
    });

    describe("others", () => {
        it("lists the insecticide classes with confirmed resistance among the site's non-filtered studies only", () => {
            const filtered = [study("pyrethroid")];
            const nonFiltered = [
                ...filtered,
                study("pyrethroidConfirmed", { RESISTANCE_STATUS: CONFIRMED }),
                study("organophosphateConfirmed", {
                    INSECTICIDE_CLASS: ORGANOPHOSPHATES,
                    RESISTANCE_STATUS: CONFIRMED,
                }),
                study("organophosphateTwice", { INSECTICIDE_CLASS: ORGANOPHOSPHATES, RESISTANCE_STATUS: CONFIRMED }),
                study("carbamateSusceptible", { INSECTICIDE_CLASS: "CARBAMATES", RESISTANCE_STATUS: SUSCEPTIBLE }),
                study(OTHER_SITE, {
                    SITE_ID: OTHER_SITE_ID,
                    INSECTICIDE_CLASS: "ORGANOCHLORINES",
                    RESISTANCE_STATUS: CONFIRMED,
                }),
                study("noClass", { INSECTICIDE_CLASS: NOT_AVAILABLE, RESISTANCE_STATUS: CONFIRMED }),
            ];

            const data = selectionData(PreventionMapType.RESISTANCE_STATUS, filtered, nonFiltered);

            expect(data.kind === "common" && data.othersDetected).toEqual([ORGANOPHOSPHATES]);
        });

        it("lists the detected mechanisms of the whitelist, in its order, missing from the filtered studies", () => {
            const mechanism = (code: string, overrides: Partial<PreventionStudy>) =>
                study(code, {
                    ASSAY_TYPE: MOLECULAR,
                    MECHANISM_STATUS: DETECTED,
                    MECHANISM_FREQUENCY: "1",
                    ...overrides,
                });
            const filtered = [mechanism("kdr", { TYPE: KDR_L1014F })];
            const nonFiltered = [
                ...filtered,
                mechanism("ace1r", { TYPE: ACE1R }),
                mechanism(ESTERASES_STUDY, { TYPE: ESTERASES }),
                mechanism("monoNotDetected", { TYPE: MONO_OXYGENASES, MECHANISM_STATUS: NOT_DETECTED }),
                mechanism("noType", { TYPE: NOT_AVAILABLE }),
            ];

            const data = selectionData(PreventionMapType.RESISTANCE_MECHANISM, filtered, nonFiltered);

            expect(data.kind === "common" && data.othersDetected).toEqual([`TYPE.${ESTERASES}`, `TYPE.${ACE1R}`]);
        });
    });
});
