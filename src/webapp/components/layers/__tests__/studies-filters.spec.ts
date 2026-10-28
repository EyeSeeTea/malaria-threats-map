import { PreventionStudy } from "../../../../domain/entities/PreventionStudy";
import { ResistanceIntensity } from "../../../../domain/entities/Study";
import { createInvasiveStudy, createPreventionStudy } from "../../../../domain/entities/__fixtures__/studyFixtures";
import {
    filterByAssayTypes,
    filterByDownload,
    filterByInsecticideClass,
    filterByInsecticideResistanceStatusOptions,
    filterByInsecticideTypes,
    filterByIntensityStatus,
    filterByLevelOfInvolvement,
    filterByOnlyDataByHealthMinistries,
    filterByOnlyIncludeBioassaysWithMoreMosquitoes,
    filterByProxyType,
    filterByRegion,
    filterByResistanceMechanism,
    filterByResistanceStatus,
    filterBySpecies,
    filterByStudiesWithInsecticideClass,
    filterByType,
    filterByTypes,
    filterByTypeSynergist,
    filterByVectorSpecies,
    filterByYearRange,
    filterInvasiveByDownload,
    filterValidMortalityAdjustedValue,
    filterValidResistanceIntensityValue,
} from "../studies-filters";

describe("studies-filters", () => {
    describe("filterByOnlyIncludeBioassaysWithMoreMosquitoes", () => {
        const runTestCases = (testCases: [number, string][], expectedResult: boolean) => {
            testCases.forEach(([filter, stringValue]) => {
                const result = filterByOnlyIncludeBioassaysWithMoreMosquitoes(filter)({
                    NUMBER: stringValue,
                } as PreventionStudy);
                expect(result).toEqual(expectedResult);
            });
        };

        it("should return true if the filter is 0, regardless the study NUMBER", () => {
            const cases: [number, string][] = [
                [0, "100"],
                [0, "bad value"],
                [0, "1+"],
                [0, "1-1000"],
                [0, "NA"],
                [0, "-1"],
                [0, "0"],
            ];
            runTestCases(cases, true);
        });

        it("should return true if the NUMBER is equal", () => {
            const cases: [number, string][] = [
                [100, "100"],
                [100, "100.0"],
                [0, "0"],
                [1, "1"],
                [500, "500"],
            ];
            runTestCases(cases, true);
        });
        it("should return false if the NUMBER is lesser", () => {
            const cases: [number, string][] = [
                [100, "99"],
                [100, "0"],
                [1, "0"],
                [2, "1"],
                [500, "10"],
            ];
            runTestCases(cases, false);
        });
        it("should return true if the NUMBER is greater", () => {
            const cases: [number, string][] = [
                [100, "101"],
                [100, "1000"],
                [1, "999"],
                [2, "3"],
                [500, "501"],
            ];
            runTestCases(cases, true);
        });
        it("should return true if NUMBER is 'NA', 'NR', '-', '.'", () => {
            const cases: [number, string][] = [
                [100, "NA"],
                [100, "NR"],
                [100, "-"],
                [100, "."],
                [0, "NR"],
            ];
            runTestCases(cases, true);
        });
        it("It should allow ranges 'N-M', use the upper bound as the target number", () => {
            const cases: [number, string][] = [
                [100, "90-110"],
                [100, "99-100"],
                [100, "0-100"],
                [100, "80-101"],
                [0, "100-120"],
                [0, "0-10"],
            ];
            runTestCases(cases, true);
            const falseCases: [number, string][] = [
                [100, "90-99"],
                [100, "10-20"],
                [2, "0-1"],
            ];
            runTestCases(falseCases, false);
        });
        it("It should allow approximate values '~N', use the number as the target number", () => {
            const cases: [number, string][] = [
                [100, "~100"],
                [100, "~101"],
                [100, "~200"],
                [0, "~1"],
                [0, "~20"],
            ];
            runTestCases(cases, true);
            const falseCases: [number, string][] = [
                [100, "~99"],
                [100, "~10"],
                [2, "~1"],
            ];
            runTestCases(falseCases, false);
        });
        it("It should max values 'N max', use the number as the target number", () => {
            const cases: [number, string][] = [
                [100, "100 max"],
                [100, "101 max"],
                [100, "200 max"],
                [0, "1 max"],
                [0, "20 max"],
            ];
            runTestCases(cases, true);
            const falseCases: [number, string][] = [
                [100, "99 max"],
                [100, "10 max"],
                [2, "1 max"],
            ];
            runTestCases(falseCases, false);
        });
        it("It should max values 'N+', always return true", () => {
            const cases: [number, string][] = [
                [100, "100+"],
                [100, "99+"],
                [100, "0+"],
                [0, "0+"],
                [0, "20+"],
                [2, "1+"],
            ];
            runTestCases(cases, true);
        });
    });

    const PYRETHROIDS = "PYRETHROIDS";
    const ORGANOPHOSPHATES = "ORGANOPHOSPHATES";
    const DELTAMETHRIN = "DELTAMETHRIN";
    const PERMETHRIN = "PERMETHRIN";
    const WHO_TEST_KIT = "WHO_TEST_KIT_ADULTS";
    const CDC_BOTTLE = "CDC_BOTTLE_ADULTS";
    const GAMBIAE = "An. gambiae s.l.";
    const FUNESTUS = "An. funestus s.l.";
    const DISCRIMINATING = "DISCRIMINATING_CONCENTRATION_BIOASSAY";
    const INTENSITY = "INTENSITY_CONCENTRATION_BIOASSAY";
    const SYNERGIST = "SYNERGIST-INSECTICIDE_BIOASSAY";
    const MOLECULAR = "MOLECULAR_ASSAY";
    const BIOCHEMICAL = "BIOCHEMICAL_ASSAY";
    const MONO_OXYGENASES = "MONO_OXYGENASES";
    const ESTERASES = "ESTERASES";

    describe("selection predicates", () => {
        describe("filterBySpecies", () => {
            const studies = [createPreventionStudy({ SPECIES: GAMBIAE }), createPreventionStudy({ SPECIES: FUNESTUS })];

            it("keeps every study when no species is selected", () => {
                expect(studies.map(filterBySpecies([]))).toEqual([true, true]);
            });

            it("keeps only the studies of the selected species", () => {
                expect(studies.map(filterBySpecies([FUNESTUS]))).toEqual([false, true]);
            });

            it("removes every study when no study has the selected species", () => {
                expect(studies.map(filterBySpecies(["An. arabiensis"]))).toEqual([false, false]);
            });
        });

        describe("filterByTypes", () => {
            const studies = [
                createPreventionStudy({ TYPE: WHO_TEST_KIT }),
                createPreventionStudy({ TYPE: CDC_BOTTLE }),
            ];

            it("keeps every study when the types are null or empty", () => {
                expect(studies.map(filterByTypes(null))).toEqual([true, true]);
                expect(studies.map(filterByTypes([]))).toEqual([true, true]);
            });

            it("keeps only the studies of the selected types", () => {
                expect(studies.map(filterByTypes([CDC_BOTTLE]))).toEqual([false, true]);
            });

            it("removes every study when no study has a selected type", () => {
                expect(studies.map(filterByTypes([MONO_OXYGENASES]))).toEqual([false, false]);
            });
        });

        describe("filterByAssayTypes", () => {
            const studies = [
                createPreventionStudy({ ASSAY_TYPE: MOLECULAR }),
                createPreventionStudy({ ASSAY_TYPE: BIOCHEMICAL }),
            ];

            it("keeps every study when no assay type is selected", () => {
                expect(studies.map(filterByAssayTypes([]))).toEqual([true, true]);
            });

            it("keeps only the studies of the selected assay types", () => {
                expect(studies.map(filterByAssayTypes([BIOCHEMICAL]))).toEqual([false, true]);
            });

            it("removes every study when no study has a selected assay type", () => {
                expect(studies.map(filterByAssayTypes([SYNERGIST]))).toEqual([false, false]);
            });
        });

        describe("filterByTypeSynergist", () => {
            const studies = [
                createPreventionStudy({ TYPE: WHO_TEST_KIT }),
                createPreventionStudy({ TYPE: CDC_BOTTLE }),
            ];

            it("keeps every study when no synergist type is selected", () => {
                expect(studies.map(filterByTypeSynergist([]))).toEqual([true, true]);
            });

            it("matches the synergist types against TYPE, not TYPE_SYNERGIST", () => {
                const study = createPreventionStudy({ TYPE: WHO_TEST_KIT, TYPE_SYNERGIST: CDC_BOTTLE });

                expect(filterByTypeSynergist([WHO_TEST_KIT])(study)).toBe(true);
                expect(filterByTypeSynergist([CDC_BOTTLE])(study)).toBe(false);
            });

            it("keeps only the studies of the selected synergist types", () => {
                expect(studies.map(filterByTypeSynergist([WHO_TEST_KIT]))).toEqual([true, false]);
            });
        });

        describe("filterByInsecticideTypes", () => {
            const studies = [
                createPreventionStudy({ INSECTICIDE_TYPE: DELTAMETHRIN }),
                createPreventionStudy({ INSECTICIDE_TYPE: PERMETHRIN }),
            ];

            it("keeps every study when no insecticide type is selected", () => {
                expect(studies.map(filterByInsecticideTypes([]))).toEqual([true, true]);
            });

            it("keeps only the studies of the selected insecticide types", () => {
                expect(studies.map(filterByInsecticideTypes([PERMETHRIN]))).toEqual([false, true]);
            });

            it("removes every study when no study has a selected insecticide type", () => {
                expect(studies.map(filterByInsecticideTypes(["MALATHION"]))).toEqual([false, false]);
            });
        });

        describe("filterByVectorSpecies", () => {
            const typeForm = createInvasiveStudy({ VECTOR_SPECIES: "An. stephensi type form" });
            const unspecified = createInvasiveStudy({ VECTOR_SPECIES: "NR" });
            const notFound = createInvasiveStudy({ VECTOR_SPECIES: "An. stephensi (not found)" });
            const studies = [typeForm, unspecified, notFound];

            it("keeps every study when no species is selected", () => {
                expect(studies.map(filterByVectorSpecies([]))).toEqual([true, true, true]);
            });

            it("maps each selected key through VectorSpeciesKey before comparing", () => {
                expect(studies.map(filterByVectorSpecies(["AN_STEPHENSI_TYPE_FORM"]))).toEqual([true, false, false]);
                expect(studies.map(filterByVectorSpecies(["AN_STEPHENSI_NOT_FOUND"]))).toEqual([false, false, true]);
            });

            it("matches the form unspecified key against the value NR", () => {
                expect(studies.map(filterByVectorSpecies(["AN_STEPHENSI_FORM_UNSPECIFIED"]))).toEqual([
                    false,
                    true,
                    false,
                ]);
            });

            it("does not match the raw value when it is selected instead of a key", () => {
                expect(studies.map(filterByVectorSpecies(["An. stephensi type form"]))).toEqual([false, false, false]);
            });
        });
    });

    describe("single-value predicates", () => {
        describe("filterByInsecticideClass", () => {
            const studies = [
                createPreventionStudy({ INSECTICIDE_CLASS: PYRETHROIDS }),
                createPreventionStudy({ INSECTICIDE_CLASS: ORGANOPHOSPHATES }),
            ];

            it("keeps only the studies of the class", () => {
                expect(studies.map(filterByInsecticideClass(PYRETHROIDS))).toEqual([true, false]);
            });

            it("keeps every study when the class is empty or null", () => {
                expect(studies.map(filterByInsecticideClass(""))).toEqual([true, true]);
                expect(studies.map(filterByInsecticideClass(null))).toEqual([true, true]);
            });
        });

        describe("filterByType", () => {
            const studies = [
                createPreventionStudy({ TYPE: MONO_OXYGENASES }),
                createPreventionStudy({ TYPE: ESTERASES }),
            ];

            it("keeps only the studies of the type", () => {
                expect(studies.map(filterByType(ESTERASES))).toEqual([false, true]);
            });

            it("keeps every study when the type is empty or null", () => {
                expect(studies.map(filterByType(""))).toEqual([true, true]);
                expect(studies.map(filterByType(null))).toEqual([true, true]);
            });
        });

        describe("filterByProxyType", () => {
            const studies = [
                createPreventionStudy({ PROXY_TYPE: MONO_OXYGENASES }),
                createPreventionStudy({ PROXY_TYPE: ESTERASES }),
            ];

            it("keeps only the studies of the proxy type", () => {
                expect(studies.map(filterByProxyType(MONO_OXYGENASES))).toEqual([true, false]);
            });

            it("keeps every study when the proxy type is empty or null", () => {
                expect(studies.map(filterByProxyType(""))).toEqual([true, true]);
                expect(studies.map(filterByProxyType(null))).toEqual([true, true]);
            });
        });
    });

    describe("filterByYearRange", () => {
        const range = [2018, 2020];
        const studies = [2017, 2018, 2019, 2020, 2021].map(year => createPreventionStudy({ YEAR_START: year }));
        const withoutYear = createPreventionStudy({ YEAR_START: undefined });

        it("keeps the years inside the range, both limits included", () => {
            expect(studies.map(filterByYearRange(range))).toEqual([false, true, true, true, false]);
        });

        it("removes a study without YEAR_START by default", () => {
            expect(filterByYearRange(range)(withoutYear)).toBe(false);
        });

        it("keeps a study without YEAR_START when allowEmpty is true", () => {
            expect(filterByYearRange(range, true)(withoutYear)).toBe(true);
        });

        it("still removes a study outside the range when allowEmpty is true", () => {
            expect(studies.map(filterByYearRange(range, true))).toEqual([false, true, true, true, false]);
        });
    });

    describe("filterByRegion", () => {
        const burkinaFaso = createPreventionStudy({
            ISO2: "BF",
            COUNTRY_NAME: "Burkina Faso",
            REGION_FULL: "AFRICA",
            SUBREGION: "WEST_AFRICA",
        });
        const india = createPreventionStudy({
            ISO2: "IN",
            COUNTRY_NAME: "India",
            REGION_FULL: "SOUTH-EAST_ASIA",
            SUBREGION: "SOUTH_ASIA",
        });
        const studies = [burkinaFaso, india];

        it("keeps every study when no region is set", () => {
            expect(studies.map(filterByRegion({}))).toEqual([true, true]);
        });

        it("matches a country by ISO2 or by country name", () => {
            expect(studies.map(filterByRegion({ country: "BF" }))).toEqual([true, false]);
            expect(studies.map(filterByRegion({ country: "India" }))).toEqual([false, true]);
        });

        it("matches a region against REGION_FULL", () => {
            expect(studies.map(filterByRegion({ region: "AFRICA" }))).toEqual([true, false]);
        });

        it("matches a subregion against SUBREGION", () => {
            expect(studies.map(filterByRegion({ subRegion: "SOUTH_ASIA" }))).toEqual([false, true]);
        });

        it("uses only the country when country and region are both set", () => {
            expect(studies.map(filterByRegion({ country: "IN", region: "AFRICA" }))).toEqual([false, true]);
        });

        it("uses only the region when region and subregion are both set", () => {
            expect(studies.map(filterByRegion({ region: "AFRICA", subRegion: "SOUTH_ASIA" }))).toEqual([true, false]);
        });

        it("ignores a site, which is not a region kind it handles", () => {
            expect(studies.map(filterByRegion({ site: "SITE_IN_001" }))).toEqual([true, true]);
        });
    });

    describe("filterByOnlyDataByHealthMinistries", () => {
        const studies = [
            createPreventionStudy({ INSTITUTION_TYPE: "MoH" }),
            createPreventionStudy({ INSTITUTION_TYPE: "Research" }),
        ];

        it("keeps only Ministry of Health studies when true", () => {
            expect(studies.map(filterByOnlyDataByHealthMinistries(true))).toEqual([true, false]);
        });

        it("keeps every study when false", () => {
            expect(studies.map(filterByOnlyDataByHealthMinistries(false))).toEqual([true, true]);
        });
    });

    describe("assay discriminators", () => {
        const assayTypes = [DISCRIMINATING, INTENSITY, SYNERGIST, MOLECULAR, BIOCHEMICAL];
        const studies = assayTypes.map(assayType => createPreventionStudy({ ASSAY_TYPE: assayType }));

        it("filterByResistanceStatus keeps only the discriminating concentration bioassay", () => {
            expect(studies.map(filterByResistanceStatus)).toEqual([true, false, false, false, false]);
        });

        it("filterByIntensityStatus keeps only the intensity concentration bioassay", () => {
            expect(studies.map(filterByIntensityStatus)).toEqual([false, true, false, false, false]);
        });

        it("filterByResistanceMechanism keeps the synergist, molecular and biochemical assays", () => {
            expect(studies.map(filterByResistanceMechanism)).toEqual([false, false, true, true, true]);
        });

        it("filterByLevelOfInvolvement keeps only the synergist-insecticide bioassay", () => {
            expect(studies.map(filterByLevelOfInvolvement)).toEqual([false, false, true, false, false]);
        });
    });

    describe("validity checks", () => {
        describe("filterValidResistanceIntensityValue", () => {
            it("keeps the four intensity levels and removes the rest", () => {
                const intensities: ResistanceIntensity[] = [
                    "LOW_INTENSITY",
                    "MODERATE_INTENSITY",
                    "MODERATE_TO_HIGH_INTENSITY",
                    "HIGH_INTENSITY",
                    "NA",
                    "COULD_NOT_BE_RELIABLY_ASSESSED",
                ];
                const studies = intensities.map(intensity =>
                    createPreventionStudy({ RESISTANCE_INTENSITY: intensity })
                );

                expect(studies.map(filterValidResistanceIntensityValue)).toEqual([
                    true,
                    true,
                    true,
                    true,
                    false,
                    false,
                ]);
            });
        });

        describe("filterValidMortalityAdjustedValue", () => {
            it("keeps a numeric value", () => {
                expect(filterValidMortalityAdjustedValue(createPreventionStudy({ MORTALITY_ADJUSTED: "0.5" }))).toBe(
                    true
                );
            });

            it("removes NA in any case, and N/A", () => {
                const values = ["NA", "na", "N/A", " NA "];
                const studies = values.map(value => createPreventionStudy({ MORTALITY_ADJUSTED: value }));

                expect(studies.map(filterValidMortalityAdjustedValue)).toEqual([false, false, false, false]);
            });

            it("removes a missing value", () => {
                expect(
                    filterValidMortalityAdjustedValue(createPreventionStudy({ MORTALITY_ADJUSTED: undefined }))
                ).toBe(false);
            });

            it("keeps NR and an empty string, which are not numbers (finding)", () => {
                const studies = ["NR", ""].map(value => createPreventionStudy({ MORTALITY_ADJUSTED: value }));

                expect(studies.map(filterValidMortalityAdjustedValue)).toEqual([true, true]);
            });
        });

        describe("filterByStudiesWithInsecticideClass", () => {
            it("removes only the class NA", () => {
                const studies = [PYRETHROIDS, "NA", ""].map(insecticideClass =>
                    createPreventionStudy({ INSECTICIDE_CLASS: insecticideClass })
                );

                expect(studies.map(filterByStudiesWithInsecticideClass)).toEqual([true, false, true]);
            });
        });

        describe("filterByInsecticideResistanceStatusOptions", () => {
            it("keeps confirmed, possible and susceptible, and removes the rest", () => {
                const statuses = ["CONFIRMED_RESISTANCE", "POSSIBLE_RESISTANCE", "SUSCEPTIBLE", "UNDETERMINED", "NA"];
                const studies = statuses.map(status => createPreventionStudy({ RESISTANCE_STATUS: status }));

                expect(studies.map(filterByInsecticideResistanceStatusOptions)).toEqual([
                    true,
                    true,
                    true,
                    false,
                    false,
                ]);
            });
        });
    });

    describe("download predicates", () => {
        describe("filterByDownload", () => {
            it("keeps only DOWNLOAD equal to 1", () => {
                const studies = [1, 0, 2].map(download => createPreventionStudy({ DOWNLOAD: download }));

                expect(studies.map(filterByDownload())).toEqual([true, false, false]);
            });
        });

        describe("filterInvasiveByDownload", () => {
            it("removes only MTM_DOWNLOAD equal to 0, so a missing value is kept", () => {
                const studies = [1, 0, undefined].map(download => createInvasiveStudy({ MTM_DOWNLOAD: download }));

                expect(studies.map(filterInvasiveByDownload())).toEqual([true, false, true]);
            });
        });
    });
});
