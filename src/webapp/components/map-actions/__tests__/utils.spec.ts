import i18next from "i18next";
import { createInvasiveFilters, createPreventionFilters } from "../../../store/__fixtures__/filtersFixtures";
import { DiagnosisFilters, PreventionDataset, PreventionMapType, TreatmentFilters } from "../../../store/types";
import {
    getValueLabelFilters,
    invasiveFiltersToString,
    invasiveValueLabelFilters,
    preventionFiltersToString,
    preventionValueLabelFilters,
} from "../utils";

// i18next runs without resources in the tests (src/setupTests.ts), so every label is its key.
const ALL = "common.map_info_summary.all";
const entry = (filter: string, value: string) => `common.map_info_summary.${filter}: ${value}`;
const speciesLabel = (key: string) => `common.filters.vector_species_options.${key}`;

const MAX_MIN_YEARS = [2010, 2024];
const NARROWED_YEARS = [2015, 2020];
const FULL_RANGE = "2010-2024";
const NARROWED_RANGE = "2015-2020";

const PYRETHROIDS = "PYRETHROIDS";
const DELTAMETHRIN = "DELTAMETHRIN";
const PERMETHRIN = "PERMETHRIN";
const WHO_TEST_KIT = "WHO_TEST_KIT_ADULTS";
const CDC_BOTTLE = "CDC_BOTTLE_ADULTS";
const GAMBIAE = "An. gambiae s.l.";
const FUNESTUS = "An. funestus s.l.";
const MONO_OXYGENASES = "MONO_OXYGENASES";
const MOLECULAR = "MOLECULAR_ASSAY";
const BIOCHEMICAL = "BIOCHEMICAL_ASSAY";
const TYPE_FORM = "AN_STEPHENSI_TYPE_FORM";
const MYSORENSIS = "AN_STEPHENSI_MYSORENSIS";

const noFilters = (mapType: PreventionMapType) => createPreventionFilters({ mapType, insecticideClass: PYRETHROIDS });

const everyFilter = (mapType: PreventionMapType) =>
    createPreventionFilters({
        mapType,
        insecticideClass: PYRETHROIDS,
        insecticideTypes: [DELTAMETHRIN, PERMETHRIN],
        type: [WHO_TEST_KIT, CDC_BOTTLE],
        species: [GAMBIAE, FUNESTUS],
        assayTypes: [MOLECULAR, BIOCHEMICAL],
        synergistTypes: [WHO_TEST_KIT],
    });

describe("map-actions utils", () => {
    it("runs with i18next returning the key, which every assertion below relies on", () => {
        expect(i18next.t("some.key")).toBe("some.key");
    });

    describe("preventionValueLabelFilters", () => {
        describe.each([PreventionMapType.RESISTANCE_STATUS, PreventionMapType.INTENSITY_STATUS])(
            "bioassay map type %s",
            mapType => {
                it("says all for every unset filter", () => {
                    expect(preventionValueLabelFilters(noFilters(mapType), MAX_MIN_YEARS, MAX_MIN_YEARS)).toEqual({
                        years: FULL_RANGE,
                        insecticideClass: PYRETHROIDS,
                        insecticideTypes: ALL,
                        testType: ALL,
                        species: ALL,
                    });
                });

                it("joins several values with a pipe", () => {
                    expect(preventionValueLabelFilters(everyFilter(mapType), MAX_MIN_YEARS, NARROWED_YEARS)).toEqual({
                        years: NARROWED_RANGE,
                        insecticideClass: PYRETHROIDS,
                        insecticideTypes: `${DELTAMETHRIN} | ${PERMETHRIN}`,
                        testType: `${WHO_TEST_KIT} | ${CDC_BOTTLE}`,
                        species: `${GAMBIAE} | ${FUNESTUS}`,
                    });
                });
            }
        );

        describe("Resistance mechanisms", () => {
            it("says all for mechanism and species, and leaves the assay types empty", () => {
                const filters = noFilters(PreventionMapType.RESISTANCE_MECHANISM);

                expect(preventionValueLabelFilters(filters, MAX_MIN_YEARS, MAX_MIN_YEARS)).toEqual({
                    years: FULL_RANGE,
                    assayTypes: "",
                    mechanismType: ALL,
                    species: ALL,
                });
            });

            it("joins several values with a pipe", () => {
                const filters = everyFilter(PreventionMapType.RESISTANCE_MECHANISM);

                expect(preventionValueLabelFilters(filters, MAX_MIN_YEARS, MAX_MIN_YEARS)).toEqual({
                    years: FULL_RANGE,
                    assayTypes: `${MOLECULAR} | ${BIOCHEMICAL}`,
                    mechanismType: `${WHO_TEST_KIT} | ${CDC_BOTTLE}`,
                    species: `${GAMBIAE} | ${FUNESTUS}`,
                });
            });
        });

        describe("Level of involvement", () => {
            it("says all for test type and species, and leaves the synergist types empty", () => {
                const filters = noFilters(PreventionMapType.LEVEL_OF_INVOLVEMENT);

                expect(preventionValueLabelFilters(filters, MAX_MIN_YEARS, MAX_MIN_YEARS)).toEqual({
                    years: FULL_RANGE,
                    synergistTypes: "",
                    testType: ALL,
                    species: ALL,
                });
            });

            it("joins several values with a pipe, and shows the test type, not the proxy type", () => {
                const filters = { ...everyFilter(PreventionMapType.LEVEL_OF_INVOLVEMENT), proxyType: MONO_OXYGENASES };

                expect(preventionValueLabelFilters(filters, MAX_MIN_YEARS, MAX_MIN_YEARS)).toEqual({
                    years: FULL_RANGE,
                    synergistTypes: WHO_TEST_KIT,
                    testType: `${WHO_TEST_KIT} | ${CDC_BOTTLE}`,
                    species: `${GAMBIAE} | ${FUNESTUS}`,
                });
            });
        });

        it("returns undefined for an unknown map type", () => {
            expect(preventionValueLabelFilters(noFilters(99), MAX_MIN_YEARS, MAX_MIN_YEARS)).toBe(undefined);
        });
    });

    describe("invasiveValueLabelFilters", () => {
        it("says all when no species is selected", () => {
            expect(invasiveValueLabelFilters(createInvasiveFilters(), MAX_MIN_YEARS, NARROWED_YEARS)).toEqual({
                years: NARROWED_RANGE,
                vectorSpecies: ALL,
            });
        });

        it("shows the label of each selected species, joined with a pipe", () => {
            expect(
                invasiveValueLabelFilters(
                    createInvasiveFilters({ vectorSpecies: [TYPE_FORM] }),
                    MAX_MIN_YEARS,
                    MAX_MIN_YEARS
                )
            ).toEqual({ years: FULL_RANGE, vectorSpecies: speciesLabel(TYPE_FORM) });

            expect(
                invasiveValueLabelFilters(
                    createInvasiveFilters({ vectorSpecies: [TYPE_FORM, MYSORENSIS] }),
                    MAX_MIN_YEARS,
                    MAX_MIN_YEARS
                )
            ).toEqual({ years: FULL_RANGE, vectorSpecies: `${speciesLabel(TYPE_FORM)} | ${speciesLabel(MYSORENSIS)}` });
        });

        it("throws for a species that is not in the hardcoded list (finding)", () => {
            const filters = createInvasiveFilters({ vectorSpecies: ["AN_GAMBIAE"] });

            expect(() => invasiveValueLabelFilters(filters, MAX_MIN_YEARS, MAX_MIN_YEARS)).toThrow(TypeError);
        });
    });

    describe("preventionFiltersToString", () => {
        const bioassayAll = (years: string) =>
            [
                entry("insecticideClass", PYRETHROIDS),
                entry("insecticideTypes", ALL),
                entry("testType", ALL),
                entry("species", ALL),
                entry("years", years),
            ].join(" | ");

        const bioassayEvery = [
            entry("insecticideClass", PYRETHROIDS),
            entry("insecticideTypes", `${DELTAMETHRIN}, ${PERMETHRIN}`),
            entry("testType", `${WHO_TEST_KIT}, ${CDC_BOTTLE}`),
            entry("species", `${GAMBIAE}, ${FUNESTUS}`),
            entry("years", FULL_RANGE),
        ].join(" | ");

        describe("from the map", () => {
            describe.each([PreventionMapType.RESISTANCE_STATUS, PreventionMapType.INTENSITY_STATUS])(
                "bioassay map type %s",
                mapType => {
                    it("says all for every unset filter, with the full year range", () => {
                        expect(
                            preventionFiltersToString(noFilters(mapType), MAX_MIN_YEARS, MAX_MIN_YEARS, "map")
                        ).toEqual(bioassayAll(FULL_RANGE));
                    });

                    it("shows the narrowed year range", () => {
                        expect(
                            preventionFiltersToString(noFilters(mapType), MAX_MIN_YEARS, NARROWED_YEARS, "map")
                        ).toEqual(bioassayAll(NARROWED_RANGE));
                    });

                    it("joins the values of one filter with a comma", () => {
                        expect(
                            preventionFiltersToString(everyFilter(mapType), MAX_MIN_YEARS, MAX_MIN_YEARS, "map")
                        ).toEqual(bioassayEvery);
                    });
                }
            );

            it("Resistance mechanisms shows mechanism, assay types, species and years", () => {
                const filters = everyFilter(PreventionMapType.RESISTANCE_MECHANISM);

                expect(preventionFiltersToString(filters, MAX_MIN_YEARS, MAX_MIN_YEARS, "map")).toEqual(
                    [
                        entry("testType", `${WHO_TEST_KIT}, ${CDC_BOTTLE}`),
                        entry("assayTypes", `${MOLECULAR}, ${BIOCHEMICAL}`),
                        entry("species", `${GAMBIAE}, ${FUNESTUS}`),
                        entry("years", FULL_RANGE),
                    ].join(" | ")
                );
            });

            it("Level of involvement shows test type, synergist types, species and years", () => {
                const filters = noFilters(PreventionMapType.LEVEL_OF_INVOLVEMENT);

                expect(preventionFiltersToString(filters, MAX_MIN_YEARS, MAX_MIN_YEARS, "map")).toEqual(
                    [
                        entry("testType", ALL),
                        entry("synergistTypes", ALL),
                        entry("species", ALL),
                        entry("years", FULL_RANGE),
                    ].join(" | ")
                );
            });
        });

        describe("from the download", () => {
            const mechanismDatasets: ReadonlyArray<PreventionDataset> = ["MOLECULAR_ASSAY", "BIOCHEMICAL_ASSAY"];

            const datasetFilters = (dataset: "DISCRIMINATING_CONCENTRATION_BIOASSAY" | "MOLECULAR_ASSAY") =>
                createPreventionFilters({ ...everyFilter(PreventionMapType.RESISTANCE_STATUS), dataset });

            it("a bioassay dataset shows the same filters as its map", () => {
                const filters = datasetFilters("DISCRIMINATING_CONCENTRATION_BIOASSAY");

                expect(preventionFiltersToString(filters, MAX_MIN_YEARS, MAX_MIN_YEARS, "download")).toEqual(
                    bioassayEvery
                );
            });

            it.each(mechanismDatasets)("%s shows test type, species and years", dataset => {
                const filters = createPreventionFilters({
                    ...everyFilter(PreventionMapType.RESISTANCE_STATUS),
                    dataset,
                });

                expect(preventionFiltersToString(filters, MAX_MIN_YEARS, MAX_MIN_YEARS, "download")).toEqual(
                    [
                        entry("testType", `${WHO_TEST_KIT}, ${CDC_BOTTLE}`),
                        entry("species", `${GAMBIAE}, ${FUNESTUS}`),
                        entry("years", FULL_RANGE),
                    ].join(" | ")
                );
            });

            it("the synergist dataset shows species and years only", () => {
                const filters = createPreventionFilters({
                    ...everyFilter(PreventionMapType.RESISTANCE_STATUS),
                    dataset: "SYNERGIST-INSECTICIDE_BIOASSAY",
                });

                expect(preventionFiltersToString(filters, MAX_MIN_YEARS, NARROWED_YEARS, "download")).toEqual(
                    [entry("species", `${GAMBIAE}, ${FUNESTUS}`), entry("years", NARROWED_RANGE)].join(" | ")
                );
            });
        });
    });

    describe("invasiveFiltersToString", () => {
        it("says all when no species is selected", () => {
            expect(invasiveFiltersToString(createInvasiveFilters(), MAX_MIN_YEARS, MAX_MIN_YEARS, "map")).toEqual(
                [entry("vectorSpecies", ALL), entry("years", FULL_RANGE)].join(" | ")
            );
        });

        it("shows the labels of the selected species, joined with a comma, and the narrowed years", () => {
            const filters = createInvasiveFilters({ vectorSpecies: [TYPE_FORM, MYSORENSIS] });

            expect(invasiveFiltersToString(filters, MAX_MIN_YEARS, NARROWED_YEARS, "download")).toEqual(
                [
                    entry("vectorSpecies", `${speciesLabel(TYPE_FORM)}, ${speciesLabel(MYSORENSIS)}`),
                    entry("years", NARROWED_RANGE),
                ].join(" | ")
            );
        });

        it("throws for a species that is not in the hardcoded list (finding)", () => {
            const filters = createInvasiveFilters({ vectorSpecies: ["AN_GAMBIAE"] });

            expect(() => invasiveFiltersToString(filters, MAX_MIN_YEARS, MAX_MIN_YEARS, "map")).toThrow(TypeError);
        });
    });

    describe("getValueLabelFilters", () => {
        const treatmentFilters: TreatmentFilters = {
            mapType: 0,
            dataset: "THERAPEUTIC_EFFICACY_STUDY",
            plasmodiumSpecies: [],
            drugs: [],
            molecularMarkers: [],
            excludeLowerPatients: false,
            excludeLowerSamples: false,
        };
        const diagnosisFilters: DiagnosisFilters = {
            mapType: 0,
            dataset: "PFHRP23_GENE_DELETIONS",
            surveyTypes: [],
            patientType: null,
            deletionType: null,
        };
        const preventionFilters = everyFilter(PreventionMapType.RESISTANCE_STATUS);
        const invasiveFilters = createInvasiveFilters({ vectorSpecies: [TYPE_FORM] });

        const labelsFor = (theme: string) =>
            getValueLabelFilters(
                theme,
                preventionFilters,
                treatmentFilters,
                diagnosisFilters,
                invasiveFilters,
                MAX_MIN_YEARS,
                NARROWED_YEARS
            );

        it("sends prevention to preventionValueLabelFilters", () => {
            expect(labelsFor("prevention")).toEqual(
                preventionValueLabelFilters(preventionFilters, MAX_MIN_YEARS, NARROWED_YEARS)
            );
        });

        it("sends invasive to invasiveValueLabelFilters", () => {
            expect(labelsFor("invasive")).toEqual({ years: NARROWED_RANGE, vectorSpecies: speciesLabel(TYPE_FORM) });
        });

        it("returns undefined for an unknown theme", () => {
            expect(labelsFor("unknown")).toBe(undefined);
        });
    });
});
