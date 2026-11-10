import i18next from "i18next";
import { createInvasiveFilters, createPreventionFilters } from "../../../store/__fixtures__/filtersFixtures";
import {
    DiagnosisFilters,
    PreventionDataset,
    PreventionFilters,
    PreventionMapType,
    TreatmentFilters,
} from "../../../store/types";
import {
    getValueLabelFilters,
    invasiveFiltersToString,
    invasiveValueLabelFilters,
    preventionFiltersToString,
    preventionValueLabelFilters,
} from "../utils";
import {
    BIOCHEMICAL,
    CDC_BOTTLE,
    DELTAMETHRIN,
    DISCRIMINATING,
    ESTERASES,
    FUNESTUS,
    GAMBIAE,
    MOLECULAR,
    MONO_OXYGENASES,
    PERMETHRIN,
    PYRETHROIDS,
    SYNERGIST,
    WHO_TEST_KIT,
} from "../../../../domain/entities/__fixtures__/studyValues";

const TEST_TYPE_FILTER = "testType";
const SPECIES_FILTER = "species";
const YEARS_FILTER = "years";
const INSECTICIDE_CLASS_FILTER = "insecticideClass";
const INSECTICIDE_TYPES_FILTER = "insecticideTypes";
const ASSAY_TYPES_FILTER = "assayTypes";
const SYNERGIST_TYPES_FILTER = "synergistTypes";
const VECTOR_SPECIES_FILTER = "vectorSpecies";
const SEPARATOR = " | ";
const MAP = "map";
const DOWNLOAD = "download";
const SOME_KEY = "some.key";
const UNLISTED_SPECIES = "AN_GAMBIAE";

// i18next runs without resources in the tests (src/setupTests.ts), so every label is its key.
const ALL = "common.map_info_summary.all";
const entry = (filter: string, value: string) => `common.map_info_summary.${filter}: ${value}`;
const speciesLabel = (key: string) => `common.filters.vector_species_options.${key}`;

const MAX_MIN_YEARS = [2010, 2024];
const NARROWED_YEARS = [2015, 2020];
const FULL_RANGE = "2010-2024";
const NARROWED_RANGE = "2015-2020";

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

// On the resistance mechanisms map, the type filter holds mechanisms, not test kits.
const everyMechanismFilter = () => ({
    ...everyFilter(PreventionMapType.RESISTANCE_MECHANISM),
    type: [MONO_OXYGENASES, ESTERASES],
});

describe("map-actions utils", () => {
    it("runs with i18next returning the key, which every assertion below relies on", () => {
        expect(i18next.t(SOME_KEY)).toBe(SOME_KEY);
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
                const filters = everyMechanismFilter();

                expect(preventionValueLabelFilters(filters, MAX_MIN_YEARS, MAX_MIN_YEARS)).toEqual({
                    years: FULL_RANGE,
                    assayTypes: `${MOLECULAR} | ${BIOCHEMICAL}`,
                    mechanismType: `${MONO_OXYGENASES} | ${ESTERASES}`,
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
            const filters = createInvasiveFilters({ vectorSpecies: [UNLISTED_SPECIES] });

            expect(() => invasiveValueLabelFilters(filters, MAX_MIN_YEARS, MAX_MIN_YEARS)).toThrow(TypeError);
        });
    });

    describe("preventionFiltersToString", () => {
        const bioassayAll = (years: string) =>
            [
                entry(INSECTICIDE_CLASS_FILTER, PYRETHROIDS),
                entry(INSECTICIDE_TYPES_FILTER, ALL),
                entry(TEST_TYPE_FILTER, ALL),
                entry(SPECIES_FILTER, ALL),
                entry(YEARS_FILTER, years),
            ].join(SEPARATOR);

        const bioassayEvery = [
            entry(INSECTICIDE_CLASS_FILTER, PYRETHROIDS),
            entry(INSECTICIDE_TYPES_FILTER, `${DELTAMETHRIN}, ${PERMETHRIN}`),
            entry(TEST_TYPE_FILTER, `${WHO_TEST_KIT}, ${CDC_BOTTLE}`),
            entry(SPECIES_FILTER, `${GAMBIAE}, ${FUNESTUS}`),
            entry(YEARS_FILTER, FULL_RANGE),
        ].join(SEPARATOR);

        describe("from the map", () => {
            describe.each([PreventionMapType.RESISTANCE_STATUS, PreventionMapType.INTENSITY_STATUS])(
                "bioassay map type %s",
                mapType => {
                    it("says all for every unset filter, with the full year range", () => {
                        expect(
                            preventionFiltersToString(noFilters(mapType), MAX_MIN_YEARS, MAX_MIN_YEARS, MAP)
                        ).toEqual(bioassayAll(FULL_RANGE));
                    });

                    it("shows the narrowed year range", () => {
                        expect(
                            preventionFiltersToString(noFilters(mapType), MAX_MIN_YEARS, NARROWED_YEARS, MAP)
                        ).toEqual(bioassayAll(NARROWED_RANGE));
                    });

                    it("joins the values of one filter with a comma", () => {
                        expect(
                            preventionFiltersToString(everyFilter(mapType), MAX_MIN_YEARS, MAX_MIN_YEARS, MAP)
                        ).toEqual(bioassayEvery);
                    });
                }
            );

            it("Resistance mechanisms shows mechanism, assay types, species and years", () => {
                const filters = everyMechanismFilter();

                expect(preventionFiltersToString(filters, MAX_MIN_YEARS, MAX_MIN_YEARS, MAP)).toEqual(
                    [
                        entry(TEST_TYPE_FILTER, `${MONO_OXYGENASES}, ${ESTERASES}`),
                        entry(ASSAY_TYPES_FILTER, `${MOLECULAR}, ${BIOCHEMICAL}`),
                        entry(SPECIES_FILTER, `${GAMBIAE}, ${FUNESTUS}`),
                        entry(YEARS_FILTER, FULL_RANGE),
                    ].join(SEPARATOR)
                );
            });

            it("Level of involvement shows test type, synergist types, species and years", () => {
                const filters = noFilters(PreventionMapType.LEVEL_OF_INVOLVEMENT);

                expect(preventionFiltersToString(filters, MAX_MIN_YEARS, MAX_MIN_YEARS, MAP)).toEqual(
                    [
                        entry(TEST_TYPE_FILTER, ALL),
                        entry(SYNERGIST_TYPES_FILTER, ALL),
                        entry(SPECIES_FILTER, ALL),
                        entry(YEARS_FILTER, FULL_RANGE),
                    ].join(SEPARATOR)
                );
            });
        });

        describe("from the download", () => {
            const mechanismDatasets: ReadonlyArray<PreventionDataset> = [MOLECULAR, BIOCHEMICAL];

            const downloadFilters = (dataset: PreventionDataset): PreventionFilters => ({
                ...everyFilter(PreventionMapType.RESISTANCE_STATUS),
                dataset,
            });

            it("a bioassay dataset shows the same filters as its map", () => {
                const filters = downloadFilters(DISCRIMINATING);

                expect(preventionFiltersToString(filters, MAX_MIN_YEARS, MAX_MIN_YEARS, DOWNLOAD)).toEqual(
                    bioassayEvery
                );
            });

            it.each(mechanismDatasets)("%s shows test type, species and years", dataset => {
                const filters = downloadFilters(dataset);

                expect(preventionFiltersToString(filters, MAX_MIN_YEARS, MAX_MIN_YEARS, DOWNLOAD)).toEqual(
                    [
                        entry(TEST_TYPE_FILTER, `${WHO_TEST_KIT}, ${CDC_BOTTLE}`),
                        entry(SPECIES_FILTER, `${GAMBIAE}, ${FUNESTUS}`),
                        entry(YEARS_FILTER, FULL_RANGE),
                    ].join(SEPARATOR)
                );
            });

            it("the synergist dataset shows species and years only", () => {
                const filters = downloadFilters(SYNERGIST);

                expect(preventionFiltersToString(filters, MAX_MIN_YEARS, NARROWED_YEARS, DOWNLOAD)).toEqual(
                    [entry(SPECIES_FILTER, `${GAMBIAE}, ${FUNESTUS}`), entry(YEARS_FILTER, NARROWED_RANGE)].join(
                        SEPARATOR
                    )
                );
            });
        });
    });

    describe("invasiveFiltersToString", () => {
        it("says all when no species is selected", () => {
            expect(invasiveFiltersToString(createInvasiveFilters(), MAX_MIN_YEARS, MAX_MIN_YEARS, MAP)).toEqual(
                [entry(VECTOR_SPECIES_FILTER, ALL), entry(YEARS_FILTER, FULL_RANGE)].join(SEPARATOR)
            );
        });

        it("shows the labels of the selected species, joined with a comma, and the narrowed years", () => {
            const filters = createInvasiveFilters({ vectorSpecies: [TYPE_FORM, MYSORENSIS] });

            expect(invasiveFiltersToString(filters, MAX_MIN_YEARS, NARROWED_YEARS, DOWNLOAD)).toEqual(
                [
                    entry(VECTOR_SPECIES_FILTER, `${speciesLabel(TYPE_FORM)}, ${speciesLabel(MYSORENSIS)}`),
                    entry(YEARS_FILTER, NARROWED_RANGE),
                ].join(SEPARATOR)
            );
        });

        it("throws for a species that is not in the hardcoded list (finding)", () => {
            const filters = createInvasiveFilters({ vectorSpecies: [UNLISTED_SPECIES] });

            expect(() => invasiveFiltersToString(filters, MAX_MIN_YEARS, MAX_MIN_YEARS, MAP)).toThrow(TypeError);
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
