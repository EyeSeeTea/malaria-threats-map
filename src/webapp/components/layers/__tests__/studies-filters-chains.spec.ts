import { createInvasiveStudy, createPreventionStudy } from "../../../../domain/entities/__fixtures__/studyFixtures";
import { InvasiveStudy } from "../../../../domain/entities/InvasiveStudy";
import { PreventionStudy } from "../../../../domain/entities/PreventionStudy";
import { Source } from "../../../store/actions/base-actions";
import { createInvasiveFilters, createPreventionFilters } from "../../../store/__fixtures__/filtersFixtures";
import {
    InvasiveFilters,
    PreventionDataset,
    PreventionFilters,
    PreventionMapType,
    RegionState,
} from "../../../store/types";
import { filterInvasiveStudies, filterPreventionStudies } from "../studies-filters";
import {
    ACE1R,
    BIOCHEMICAL,
    CDC_BOTTLE,
    DELTAMETHRIN,
    DISCRIMINATING,
    ESTERASES,
    FUNESTUS,
    GAMBIAE,
    GSTS,
    INTENSITY,
    KDR_L1014F,
    KDR_L1014S,
    MINISTRY_OF_HEALTH,
    MOLECULAR,
    MONO_OXYGENASES,
    NOT_AVAILABLE,
    NOT_REPORTED,
    ORGANOPHOSPHATES,
    OTHER_COUNTRY,
    PERMETHRIN,
    PYRETHROIDS,
    RESEARCH_INSTITUTION,
    SYNERGIST,
    WHO_TEST_KIT,
} from "../../../../domain/entities/__fixtures__/studyValues";

const MAP = "map";
const DOWNLOAD = "download";
const OTHER_CLASS = "otherClass";
const OTHER_INSECTICIDE = "otherInsecticide";
const OTHER_TEST_TYPE = "otherTestType";
const OTHER_SPECIES = "otherSpecies";
const OUTSIDE_YEARS = "outsideYears";
const OTHER_COUNTRY_STUDY = "otherCountry";
const KEPT = "kept";
const NOT_MOH = "notMoH";
const FEW_MOSQUITOES = "fewMosquitoes";
const FEW_MOSQUITOES_NUMBER = "20";
const NA_MORTALITY = "naMortality";
const NA_INTENSITY = "naIntensity";
const MOLECULAR_STUDY = "molecular";
const OTHER_ASSAY_TYPE = "otherAssayType";
const SYNERGIST_STUDY = "synergist";
const WITHOUT_YEAR = "withoutYear";
const NOT_DOWNLOADABLE = "notDownloadable";
const TYPE_FORM_KEY = "AN_STEPHENSI_TYPE_FORM";
const BIOCHEMICAL_STUDY = "biochemical";
const MONO_OXYGENASES_STUDY = "monoOxygenases";
const KDR_STUDY = "kdr";
const MOLECULAR_ASSAY_STUDY = "molecularAssay";

const YEARS = [2018, 2022];
const OUTSIDE_YEAR = 2015;
const PREVENTION_REGION: RegionState = { country: "BF" };
const INVASIVE_REGION: RegionState = { country: "DJ" };

function survivingPrevention(
    studies: PreventionStudy[],
    filters: PreventionFilters,
    from: Source = MAP
): ReadonlyArray<string> {
    return filterPreventionStudies(studies, filters, YEARS, PREVENTION_REGION, from).map(study => study.Code);
}

function survivingInvasive(
    studies: InvasiveStudy[],
    filters: InvasiveFilters,
    from: Source = MAP
): ReadonlyArray<string> {
    return filterInvasiveStudies(studies, filters, YEARS, INVASIVE_REGION, from).map(study => study.Code);
}

/** A study that passes every filter set by `bioassayFilters`, with the given code and overrides. */
function bioassayStudy(code: string, overrides: Partial<PreventionStudy> = {}): PreventionStudy {
    return createPreventionStudy({
        Code: code,
        INSECTICIDE_CLASS: PYRETHROIDS,
        INSECTICIDE_TYPE: DELTAMETHRIN,
        TYPE: WHO_TEST_KIT,
        SPECIES: GAMBIAE,
        YEAR_START: 2020,
        INSTITUTION_TYPE: MINISTRY_OF_HEALTH,
        NUMBER: "100",
        MORTALITY_ADJUSTED: "0.85",
        RESISTANCE_INTENSITY: "HIGH_INTENSITY",
        ...overrides,
    });
}

const bioassayFilters = (overrides: Partial<PreventionFilters>) =>
    createPreventionFilters({
        insecticideClass: PYRETHROIDS,
        insecticideTypes: [DELTAMETHRIN],
        type: [WHO_TEST_KIT],
        species: [GAMBIAE],
        onlyByHealthMinistries: true,
        onlyIncludeBioassaysWithMoreMosquitoes: 50,
        ...overrides,
    });

const studiesRemovedByEachBioassayFilter = (assayType: string) => [
    bioassayStudy(OTHER_CLASS, { ASSAY_TYPE: assayType, INSECTICIDE_CLASS: ORGANOPHOSPHATES }),
    bioassayStudy(OTHER_INSECTICIDE, { ASSAY_TYPE: assayType, INSECTICIDE_TYPE: PERMETHRIN }),
    bioassayStudy(OTHER_TEST_TYPE, { ASSAY_TYPE: assayType, TYPE: CDC_BOTTLE }),
    bioassayStudy(OTHER_SPECIES, { ASSAY_TYPE: assayType, SPECIES: FUNESTUS }),
    bioassayStudy(OUTSIDE_YEARS, { ASSAY_TYPE: assayType, YEAR_START: OUTSIDE_YEAR }),
    bioassayStudy(OTHER_COUNTRY_STUDY, { ASSAY_TYPE: assayType, ...OTHER_COUNTRY }),
];

describe("studies-filters chains", () => {
    describe("map, prevention", () => {
        describe("Resistance status", () => {
            const filters = bioassayFilters({ mapType: PreventionMapType.RESISTANCE_STATUS });

            it("removes a study for each filter of its chain", () => {
                const studies = [
                    bioassayStudy(KEPT),
                    ...studiesRemovedByEachBioassayFilter(DISCRIMINATING),
                    bioassayStudy(NOT_MOH, { INSTITUTION_TYPE: RESEARCH_INSTITUTION }),
                    bioassayStudy(FEW_MOSQUITOES, { NUMBER: FEW_MOSQUITOES_NUMBER }),
                    bioassayStudy(NA_MORTALITY, { MORTALITY_ADJUSTED: NOT_AVAILABLE }),
                ];

                expect(survivingPrevention(studies, filters)).toEqual([KEPT]);
            });

            it("keeps a study without intensity, which the intensity map removes", () => {
                const studies = [bioassayStudy(NA_INTENSITY, { RESISTANCE_INTENSITY: NOT_AVAILABLE })];

                expect(survivingPrevention(studies, filters)).toEqual([NA_INTENSITY]);
            });

            it("does not filter by assay type, the studies of the map type are already split", () => {
                const studies = [bioassayStudy(MOLECULAR_STUDY, { ASSAY_TYPE: MOLECULAR })];

                expect(survivingPrevention(studies, filters)).toEqual([MOLECULAR_STUDY]);
            });
        });

        describe("Intensity status", () => {
            const filters = bioassayFilters({ mapType: PreventionMapType.INTENSITY_STATUS });

            it("removes a study for each filter of its chain", () => {
                const studies = [
                    bioassayStudy(KEPT, { ASSAY_TYPE: INTENSITY }),
                    ...studiesRemovedByEachBioassayFilter(INTENSITY),
                    bioassayStudy(NOT_MOH, { INSTITUTION_TYPE: RESEARCH_INSTITUTION }),
                    bioassayStudy(FEW_MOSQUITOES, { NUMBER: FEW_MOSQUITOES_NUMBER }),
                    bioassayStudy(NA_INTENSITY, { RESISTANCE_INTENSITY: NOT_AVAILABLE }),
                    bioassayStudy("unassessedIntensity", { RESISTANCE_INTENSITY: "COULD_NOT_BE_RELIABLY_ASSESSED" }),
                ];

                expect(survivingPrevention(studies, filters)).toEqual([KEPT]);
            });

            it("keeps a study without adjusted mortality, which the resistance status map removes", () => {
                const studies = [bioassayStudy(NA_MORTALITY, { MORTALITY_ADJUSTED: NOT_AVAILABLE })];

                expect(survivingPrevention(studies, filters)).toEqual([NA_MORTALITY]);
            });
        });

        describe("Resistance mechanisms", () => {
            const mechanismStudy = (code: string, overrides: Partial<PreventionStudy> = {}) =>
                bioassayStudy(code, { ASSAY_TYPE: MOLECULAR, TYPE: MONO_OXYGENASES, ...overrides });

            const filters = bioassayFilters({
                mapType: PreventionMapType.RESISTANCE_MECHANISM,
                type: [MONO_OXYGENASES],
                assayTypes: [MOLECULAR, BIOCHEMICAL],
                synergistTypes: [CDC_BOTTLE],
            });

            it("removes a study for each filter of its chain", () => {
                const studies = [
                    mechanismStudy(KEPT),
                    mechanismStudy("otherMechanism", { TYPE: ESTERASES }),
                    mechanismStudy(OTHER_SPECIES, { SPECIES: FUNESTUS }),
                    mechanismStudy(OTHER_ASSAY_TYPE, { ASSAY_TYPE: SYNERGIST }),
                    mechanismStudy(OUTSIDE_YEARS, { YEAR_START: OUTSIDE_YEAR }),
                    mechanismStudy(OTHER_COUNTRY_STUDY, OTHER_COUNTRY),
                ];

                expect(survivingPrevention(studies, filters)).toEqual([KEPT]);
            });

            it("ignores the bioassay filters: insecticide, Ministry of Health, mosquitoes and mortality", () => {
                const studies = [
                    mechanismStudy(OTHER_CLASS, { INSECTICIDE_CLASS: ORGANOPHOSPHATES }),
                    mechanismStudy(OTHER_INSECTICIDE, { INSECTICIDE_TYPE: PERMETHRIN }),
                    mechanismStudy(NOT_MOH, { INSTITUTION_TYPE: RESEARCH_INSTITUTION }),
                    mechanismStudy(FEW_MOSQUITOES, { NUMBER: FEW_MOSQUITOES_NUMBER }),
                    mechanismStudy(NA_MORTALITY, { MORTALITY_ADJUSTED: NOT_AVAILABLE }),
                ];

                expect(survivingPrevention(studies, filters)).toEqual([
                    OTHER_CLASS,
                    OTHER_INSECTICIDE,
                    NOT_MOH,
                    FEW_MOSQUITOES,
                    NA_MORTALITY,
                ]);
            });

            it("ignores the synergist types when the synergist assay is not the only one selected", () => {
                const studies = [mechanismStudy(KEPT, { TYPE: MONO_OXYGENASES })];

                expect(survivingPrevention(studies, filters)).toEqual([KEPT]);
            });

            describe("with only the synergist assay selected (isSynergyst)", () => {
                // As in the data: a synergist study carries the test kit in TYPE and the mechanism in PROXY_TYPE.
                const synergistStudies = [
                    mechanismStudy(SYNERGIST_STUDY, {
                        ASSAY_TYPE: SYNERGIST,
                        TYPE: WHO_TEST_KIT,
                        PROXY_TYPE: MONO_OXYGENASES,
                    }),
                ];

                it.each([
                    ["no synergist type", []],
                    ["a synergist type", [WHO_TEST_KIT]],
                ])(
                    "removes every synergist study with %s selected, because the mechanism filter reads TYPE (finding)",
                    (_case, synergistTypes) => {
                        const synergistFilters: PreventionFilters = {
                            ...filters,
                            assayTypes: [SYNERGIST],
                            synergistTypes,
                        };

                        expect(survivingPrevention(synergistStudies, synergistFilters)).toEqual([]);
                    }
                );
            });
        });

        describe("Level of involvement", () => {
            const involvementStudy = (code: string, overrides: Partial<PreventionStudy> = {}) =>
                bioassayStudy(code, { ASSAY_TYPE: SYNERGIST, PROXY_TYPE: MONO_OXYGENASES, ...overrides });

            const filters = bioassayFilters({
                mapType: PreventionMapType.LEVEL_OF_INVOLVEMENT,
                proxyType: MONO_OXYGENASES,
                synergistTypes: [WHO_TEST_KIT],
                type: [ESTERASES],
            });

            it("removes a study for each filter of its chain", () => {
                const studies = [
                    involvementStudy(KEPT),
                    involvementStudy("otherProxyType", { PROXY_TYPE: ESTERASES }),
                    involvementStudy(OTHER_CLASS, { INSECTICIDE_CLASS: ORGANOPHOSPHATES }),
                    involvementStudy(OTHER_INSECTICIDE, { INSECTICIDE_TYPE: PERMETHRIN }),
                    involvementStudy(OTHER_SPECIES, { SPECIES: FUNESTUS }),
                    involvementStudy("otherSynergistType", { TYPE: CDC_BOTTLE }),
                    involvementStudy(OUTSIDE_YEARS, { YEAR_START: OUTSIDE_YEAR }),
                    involvementStudy(OTHER_COUNTRY_STUDY, OTHER_COUNTRY),
                ];

                expect(survivingPrevention(studies, filters)).toEqual([KEPT]);
            });

            it("ignores the test type, Ministry of Health, mosquitoes and mortality filters", () => {
                const studies = [
                    involvementStudy(NOT_MOH, { INSTITUTION_TYPE: RESEARCH_INSTITUTION }),
                    involvementStudy(FEW_MOSQUITOES, { NUMBER: FEW_MOSQUITOES_NUMBER }),
                    involvementStudy(NA_MORTALITY, { MORTALITY_ADJUSTED: NOT_AVAILABLE }),
                ];

                expect(survivingPrevention(studies, filters)).toEqual([NOT_MOH, FEW_MOSQUITOES, NA_MORTALITY]);
            });
        });
    });

    describe("map, invasive", () => {
        const studies = [
            createInvasiveStudy({ Code: KEPT }),
            createInvasiveStudy({ Code: OTHER_SPECIES, VECTOR_SPECIES: NOT_REPORTED }),
            createInvasiveStudy({ Code: OUTSIDE_YEARS, YEAR_START: OUTSIDE_YEAR }),
            createInvasiveStudy({ Code: WITHOUT_YEAR, YEAR_START: undefined }),
            createInvasiveStudy({ Code: OTHER_COUNTRY_STUDY, ...OTHER_COUNTRY }),
            createInvasiveStudy({ Code: NOT_DOWNLOADABLE, MTM_DOWNLOAD: 0 }),
        ];

        it("Vector occurrence filters by species, year range allowing no year, and region", () => {
            const filters = createInvasiveFilters({ vectorSpecies: [TYPE_FORM_KEY] });

            expect(survivingInvasive(studies, filters)).toEqual([KEPT, WITHOUT_YEAR, NOT_DOWNLOADABLE]);
        });
    });

    describe("download, prevention", () => {
        const notInMapChain = (assayType: string) => [
            bioassayStudy(NOT_MOH, { ASSAY_TYPE: assayType, INSTITUTION_TYPE: RESEARCH_INSTITUTION }),
            bioassayStudy(FEW_MOSQUITOES, { ASSAY_TYPE: assayType, NUMBER: FEW_MOSQUITOES_NUMBER }),
            bioassayStudy(NA_MORTALITY, { ASSAY_TYPE: assayType, MORTALITY_ADJUSTED: NOT_AVAILABLE }),
        ];

        const bioassayDatasets: ReadonlyArray<PreventionDataset> = [DISCRIMINATING, INTENSITY];

        describe.each(bioassayDatasets)("%s", dataset => {
            const filters = bioassayFilters({ dataset });

            it("removes a study for each filter of its chain", () => {
                const studies = [
                    bioassayStudy(KEPT, { ASSAY_TYPE: dataset }),
                    bioassayStudy(NOT_DOWNLOADABLE, { ASSAY_TYPE: dataset, DOWNLOAD: 0 }),
                    bioassayStudy(OTHER_ASSAY_TYPE, { ASSAY_TYPE: SYNERGIST }),
                    ...studiesRemovedByEachBioassayFilter(dataset),
                ];

                expect(survivingPrevention(studies, filters, DOWNLOAD)).toEqual([KEPT]);
            });

            it("ignores the Ministry of Health, mosquitoes and mortality filters of the map", () => {
                expect(survivingPrevention(notInMapChain(dataset), filters, DOWNLOAD)).toEqual([
                    NOT_MOH,
                    FEW_MOSQUITOES,
                    NA_MORTALITY,
                ]);
            });
        });

        describe("SYNERGIST-INSECTICIDE_BIOASSAY", () => {
            const filters = bioassayFilters({ dataset: SYNERGIST });

            it("removes a study for each filter of its chain", () => {
                const studies = [
                    bioassayStudy(KEPT, { ASSAY_TYPE: SYNERGIST }),
                    bioassayStudy(NOT_DOWNLOADABLE, { ASSAY_TYPE: SYNERGIST, DOWNLOAD: 0 }),
                    bioassayStudy(OTHER_ASSAY_TYPE, { ASSAY_TYPE: DISCRIMINATING }),
                    bioassayStudy(OTHER_TEST_TYPE, { ASSAY_TYPE: SYNERGIST, TYPE: CDC_BOTTLE }),
                    bioassayStudy(OTHER_SPECIES, { ASSAY_TYPE: SYNERGIST, SPECIES: FUNESTUS }),
                    bioassayStudy(OUTSIDE_YEARS, { ASSAY_TYPE: SYNERGIST, YEAR_START: OUTSIDE_YEAR }),
                    bioassayStudy(OTHER_COUNTRY_STUDY, { ASSAY_TYPE: SYNERGIST, ...OTHER_COUNTRY }),
                ];

                expect(survivingPrevention(studies, filters, DOWNLOAD)).toEqual([KEPT]);
            });

            it("ignores the insecticide class and insecticide type filters", () => {
                const studies = [
                    bioassayStudy(OTHER_CLASS, { ASSAY_TYPE: SYNERGIST, INSECTICIDE_CLASS: ORGANOPHOSPHATES }),
                    bioassayStudy(OTHER_INSECTICIDE, { ASSAY_TYPE: SYNERGIST, INSECTICIDE_TYPE: PERMETHRIN }),
                ];

                expect(survivingPrevention(studies, filters, DOWNLOAD)).toEqual([OTHER_CLASS, OTHER_INSECTICIDE]);
            });
        });

        describe("MOLECULAR_ASSAY", () => {
            const filters = bioassayFilters({ dataset: MOLECULAR, type: [GSTS] });
            const molecularStudy = (code: string, overrides: Partial<PreventionStudy> = {}) =>
                bioassayStudy(code, { ASSAY_TYPE: MOLECULAR, TYPE: MONO_OXYGENASES, ...overrides });

            it("removes a study for each filter of its chain", () => {
                const studies = [
                    molecularStudy(KEPT),
                    molecularStudy(NOT_DOWNLOADABLE, { DOWNLOAD: 0 }),
                    molecularStudy("synergistAssay", { ASSAY_TYPE: SYNERGIST }),
                    molecularStudy(OTHER_SPECIES, { SPECIES: FUNESTUS }),
                    molecularStudy(OTHER_COUNTRY_STUDY, OTHER_COUNTRY),
                ];

                expect(survivingPrevention(studies, filters, DOWNLOAD)).toEqual([KEPT]);
            });

            it("keeps biochemical assays too", () => {
                const studies = [molecularStudy(BIOCHEMICAL_STUDY, { ASSAY_TYPE: BIOCHEMICAL, TYPE: ESTERASES })];

                expect(survivingPrevention(studies, filters, DOWNLOAD)).toEqual([BIOCHEMICAL_STUDY]);
            });

            it("keeps only MOLECULAR_MECHANISM_TYPES, which are the biochemical mechanisms, so kdr is removed (finding)", () => {
                const studies = [
                    molecularStudy(MONO_OXYGENASES_STUDY, { TYPE: MONO_OXYGENASES }),
                    molecularStudy("esterases", { TYPE: ESTERASES }),
                    molecularStudy("gsts", { TYPE: GSTS }),
                    molecularStudy(KDR_STUDY, { TYPE: KDR_L1014S }),
                    molecularStudy("ace1r", { TYPE: ACE1R }),
                ];

                expect(survivingPrevention(studies, filters, DOWNLOAD)).toEqual([
                    MONO_OXYGENASES_STUDY,
                    "esterases",
                    "gsts",
                ]);
            });

            it("ignores the selected type, and the year range (finding)", () => {
                const studies = [molecularStudy(OUTSIDE_YEARS, { YEAR_START: OUTSIDE_YEAR })];

                expect(survivingPrevention(studies, filters, DOWNLOAD)).toEqual([OUTSIDE_YEARS]);
            });
        });

        describe("BIOCHEMICAL_ASSAY", () => {
            const filters = bioassayFilters({ dataset: BIOCHEMICAL, type: [ACE1R] });
            const biochemicalStudy = (code: string, overrides: Partial<PreventionStudy> = {}) =>
                bioassayStudy(code, { ASSAY_TYPE: BIOCHEMICAL, TYPE: ACE1R, ...overrides });

            it("removes a study for each filter of its chain", () => {
                const studies = [
                    biochemicalStudy(KEPT),
                    biochemicalStudy(NOT_DOWNLOADABLE, { DOWNLOAD: 0 }),
                    biochemicalStudy(OTHER_SPECIES, { SPECIES: FUNESTUS }),
                    biochemicalStudy(OUTSIDE_YEARS, { YEAR_START: OUTSIDE_YEAR }),
                    biochemicalStudy(OTHER_COUNTRY_STUDY, OTHER_COUNTRY),
                ];

                expect(survivingPrevention(studies, filters, DOWNLOAD)).toEqual([KEPT]);
            });

            it("keeps only BIOCHEMICAL_MECHANISM_TYPES, which are the molecular mechanisms (finding)", () => {
                const studies = [
                    biochemicalStudy(KDR_STUDY, { TYPE: KDR_L1014F }),
                    biochemicalStudy(MONO_OXYGENASES_STUDY, { TYPE: MONO_OXYGENASES }),
                ];

                expect(survivingPrevention(studies, filters, DOWNLOAD)).toEqual([KDR_STUDY]);
            });

            it("does not filter by assay type, so a molecular assay is kept (finding)", () => {
                const studies = [biochemicalStudy(MOLECULAR_ASSAY_STUDY, { ASSAY_TYPE: MOLECULAR, TYPE: KDR_L1014F })];

                expect(survivingPrevention(studies, filters, DOWNLOAD)).toEqual([MOLECULAR_ASSAY_STUDY]);
            });

            it("ignores the selected type", () => {
                const studies = [biochemicalStudy(KDR_STUDY, { TYPE: KDR_L1014S })];

                expect(survivingPrevention(studies, filters, DOWNLOAD)).toEqual([KDR_STUDY]);
            });
        });
    });

    describe("download, invasive", () => {
        const studies = [
            createInvasiveStudy({ Code: KEPT }),
            createInvasiveStudy({ Code: NOT_DOWNLOADABLE, MTM_DOWNLOAD: 0 }),
            createInvasiveStudy({ Code: OTHER_SPECIES, VECTOR_SPECIES: NOT_REPORTED }),
            createInvasiveStudy({ Code: OUTSIDE_YEARS, YEAR_START: OUTSIDE_YEAR }),
            createInvasiveStudy({ Code: WITHOUT_YEAR, YEAR_START: undefined }),
            createInvasiveStudy({ Code: OTHER_COUNTRY_STUDY, ...OTHER_COUNTRY }),
        ];

        it("Vector occurrence adds the download flag to the map chain", () => {
            const filters = createInvasiveFilters({ vectorSpecies: [TYPE_FORM_KEY] });

            expect(survivingInvasive(studies, filters, DOWNLOAD)).toEqual([KEPT, WITHOUT_YEAR]);
        });
    });
});
