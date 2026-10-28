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

const YEARS = [2018, 2022];
const OUTSIDE_YEAR = 2015;
const PREVENTION_REGION: RegionState = { country: "BF" };
const INVASIVE_REGION: RegionState = { country: "DJ" };
const OTHER_COUNTRY = { ISO2: "IN", COUNTRY_NAME: "India" };

const PYRETHROIDS = "PYRETHROIDS";
const DELTAMETHRIN = "DELTAMETHRIN";
const WHO_TEST_KIT = "WHO_TEST_KIT_ADULTS";
const CDC_BOTTLE = "CDC_BOTTLE_ADULTS";
const GAMBIAE = "An. gambiae s.l.";
const FUNESTUS = "An. funestus s.l.";
const MONO_OXYGENASES = "MONO_OXYGENASES";
const ESTERASES = "ESTERASES";
const DISCRIMINATING = "DISCRIMINATING_CONCENTRATION_BIOASSAY";
const INTENSITY = "INTENSITY_CONCENTRATION_BIOASSAY";
const SYNERGIST = "SYNERGIST-INSECTICIDE_BIOASSAY";
const MOLECULAR = "MOLECULAR_ASSAY";
const BIOCHEMICAL = "BIOCHEMICAL_ASSAY";

function survivingPrevention(
    studies: PreventionStudy[],
    filters: PreventionFilters,
    from: Source = "map"
): ReadonlyArray<string> {
    return filterPreventionStudies(studies, filters, YEARS, PREVENTION_REGION, from).map(study => study.Code);
}

function survivingInvasive(
    studies: InvasiveStudy[],
    filters: InvasiveFilters,
    from: Source = "map"
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
        INSTITUTION_TYPE: "MoH",
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
    bioassayStudy("otherClass", { ASSAY_TYPE: assayType, INSECTICIDE_CLASS: "ORGANOPHOSPHATES" }),
    bioassayStudy("otherInsecticide", { ASSAY_TYPE: assayType, INSECTICIDE_TYPE: "PERMETHRIN" }),
    bioassayStudy("otherTestType", { ASSAY_TYPE: assayType, TYPE: CDC_BOTTLE }),
    bioassayStudy("otherSpecies", { ASSAY_TYPE: assayType, SPECIES: FUNESTUS }),
    bioassayStudy("outsideYears", { ASSAY_TYPE: assayType, YEAR_START: OUTSIDE_YEAR }),
    bioassayStudy("otherCountry", { ASSAY_TYPE: assayType, ...OTHER_COUNTRY }),
];

describe("studies-filters chains", () => {
    describe("map, prevention", () => {
        describe("Resistance status", () => {
            const filters = bioassayFilters({ mapType: PreventionMapType.RESISTANCE_STATUS });

            it("removes a study for each filter of its chain", () => {
                const studies = [
                    bioassayStudy("kept"),
                    ...studiesRemovedByEachBioassayFilter(DISCRIMINATING),
                    bioassayStudy("notMoH", { INSTITUTION_TYPE: "Research" }),
                    bioassayStudy("fewMosquitoes", { NUMBER: "20" }),
                    bioassayStudy("naMortality", { MORTALITY_ADJUSTED: "NA" }),
                ];

                expect(survivingPrevention(studies, filters)).toEqual(["kept"]);
            });

            it("keeps a study without intensity, which the intensity map removes", () => {
                const studies = [bioassayStudy("naIntensity", { RESISTANCE_INTENSITY: "NA" })];

                expect(survivingPrevention(studies, filters)).toEqual(["naIntensity"]);
            });

            it("does not filter by assay type, the studies of the map type are already split", () => {
                const studies = [bioassayStudy("molecular", { ASSAY_TYPE: MOLECULAR })];

                expect(survivingPrevention(studies, filters)).toEqual(["molecular"]);
            });
        });

        describe("Intensity status", () => {
            const filters = bioassayFilters({ mapType: PreventionMapType.INTENSITY_STATUS });

            it("removes a study for each filter of its chain", () => {
                const studies = [
                    bioassayStudy("kept", { ASSAY_TYPE: INTENSITY }),
                    ...studiesRemovedByEachBioassayFilter(INTENSITY),
                    bioassayStudy("notMoH", { INSTITUTION_TYPE: "Research" }),
                    bioassayStudy("fewMosquitoes", { NUMBER: "20" }),
                    bioassayStudy("naIntensity", { RESISTANCE_INTENSITY: "NA" }),
                    bioassayStudy("unassessedIntensity", { RESISTANCE_INTENSITY: "COULD_NOT_BE_RELIABLY_ASSESSED" }),
                ];

                expect(survivingPrevention(studies, filters)).toEqual(["kept"]);
            });

            it("keeps a study without adjusted mortality, which the resistance status map removes", () => {
                const studies = [bioassayStudy("naMortality", { MORTALITY_ADJUSTED: "NA" })];

                expect(survivingPrevention(studies, filters)).toEqual(["naMortality"]);
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
                    mechanismStudy("kept"),
                    mechanismStudy("otherMechanism", { TYPE: ESTERASES }),
                    mechanismStudy("otherSpecies", { SPECIES: FUNESTUS }),
                    mechanismStudy("otherAssayType", { ASSAY_TYPE: SYNERGIST }),
                    mechanismStudy("outsideYears", { YEAR_START: OUTSIDE_YEAR }),
                    mechanismStudy("otherCountry", OTHER_COUNTRY),
                ];

                expect(survivingPrevention(studies, filters)).toEqual(["kept"]);
            });

            it("ignores the bioassay filters: insecticide, Ministry of Health, mosquitoes and mortality", () => {
                const studies = [
                    mechanismStudy("otherClass", { INSECTICIDE_CLASS: "ORGANOPHOSPHATES" }),
                    mechanismStudy("otherInsecticide", { INSECTICIDE_TYPE: "PERMETHRIN" }),
                    mechanismStudy("notMoH", { INSTITUTION_TYPE: "Research" }),
                    mechanismStudy("fewMosquitoes", { NUMBER: "20" }),
                    mechanismStudy("naMortality", { MORTALITY_ADJUSTED: "NA" }),
                ];

                expect(survivingPrevention(studies, filters)).toEqual([
                    "otherClass",
                    "otherInsecticide",
                    "notMoH",
                    "fewMosquitoes",
                    "naMortality",
                ]);
            });

            it("ignores the synergist types when the synergist assay is not the only one selected", () => {
                const studies = [mechanismStudy("kept", { TYPE: MONO_OXYGENASES })];

                expect(survivingPrevention(studies, filters)).toEqual(["kept"]);
            });

            describe("with only the synergist assay selected (isSynergyst)", () => {
                const synergistStudies = [
                    mechanismStudy("mechanismType", { ASSAY_TYPE: SYNERGIST, TYPE: MONO_OXYGENASES }),
                    mechanismStudy("testKitType", { ASSAY_TYPE: SYNERGIST, TYPE: WHO_TEST_KIT }),
                ];

                it("applies the synergist types to TYPE, so with a mechanism selected every study is removed (finding)", () => {
                    const synergistFilters: PreventionFilters = {
                        ...filters,
                        assayTypes: [SYNERGIST],
                        synergistTypes: [WHO_TEST_KIT],
                    };

                    expect(survivingPrevention(synergistStudies, synergistFilters)).toEqual([]);
                });

                it("keeps the mechanism studies when no synergist type is selected", () => {
                    const synergistFilters: PreventionFilters = {
                        ...filters,
                        assayTypes: [SYNERGIST],
                        synergistTypes: [],
                    };

                    expect(survivingPrevention(synergistStudies, synergistFilters)).toEqual(["mechanismType"]);
                });
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
                    involvementStudy("kept"),
                    involvementStudy("otherProxyType", { PROXY_TYPE: ESTERASES }),
                    involvementStudy("otherClass", { INSECTICIDE_CLASS: "ORGANOPHOSPHATES" }),
                    involvementStudy("otherInsecticide", { INSECTICIDE_TYPE: "PERMETHRIN" }),
                    involvementStudy("otherSpecies", { SPECIES: FUNESTUS }),
                    involvementStudy("otherSynergistType", { TYPE: CDC_BOTTLE }),
                    involvementStudy("outsideYears", { YEAR_START: OUTSIDE_YEAR }),
                    involvementStudy("otherCountry", OTHER_COUNTRY),
                ];

                expect(survivingPrevention(studies, filters)).toEqual(["kept"]);
            });

            it("ignores the test type, Ministry of Health, mosquitoes and mortality filters", () => {
                const studies = [
                    involvementStudy("notMoH", { INSTITUTION_TYPE: "Research" }),
                    involvementStudy("fewMosquitoes", { NUMBER: "20" }),
                    involvementStudy("naMortality", { MORTALITY_ADJUSTED: "NA" }),
                ];

                expect(survivingPrevention(studies, filters)).toEqual(["notMoH", "fewMosquitoes", "naMortality"]);
            });
        });
    });

    describe("map, invasive", () => {
        const studies = [
            createInvasiveStudy({ Code: "kept" }),
            createInvasiveStudy({ Code: "otherSpecies", VECTOR_SPECIES: "NR" }),
            createInvasiveStudy({ Code: "outsideYears", YEAR_START: OUTSIDE_YEAR }),
            createInvasiveStudy({ Code: "withoutYear", YEAR_START: undefined }),
            createInvasiveStudy({ Code: "otherCountry", ...OTHER_COUNTRY }),
            createInvasiveStudy({ Code: "notDownloadable", MTM_DOWNLOAD: 0 }),
        ];

        it("Vector occurrence filters by species, year range allowing no year, and region", () => {
            const filters = createInvasiveFilters({ vectorSpecies: ["AN_STEPHENSI_TYPE_FORM"] });

            expect(survivingInvasive(studies, filters)).toEqual(["kept", "withoutYear", "notDownloadable"]);
        });

        it("an unknown map type filters by region only", () => {
            const filters = createInvasiveFilters({ mapType: 1, vectorSpecies: ["AN_STEPHENSI_TYPE_FORM"] });

            expect(survivingInvasive(studies, filters)).toEqual([
                "kept",
                "otherSpecies",
                "outsideYears",
                "withoutYear",
                "notDownloadable",
            ]);
        });
    });

    describe("download, prevention", () => {
        const notInMapChain = (assayType: string) => [
            bioassayStudy("notMoH", { ASSAY_TYPE: assayType, INSTITUTION_TYPE: "Research" }),
            bioassayStudy("fewMosquitoes", { ASSAY_TYPE: assayType, NUMBER: "20" }),
            bioassayStudy("naMortality", { ASSAY_TYPE: assayType, MORTALITY_ADJUSTED: "NA" }),
        ];

        const bioassayDatasets: ReadonlyArray<PreventionDataset> = [DISCRIMINATING, INTENSITY];

        describe.each(bioassayDatasets)("%s", dataset => {
            const filters = bioassayFilters({ dataset });

            it("removes a study for each filter of its chain", () => {
                const studies = [
                    bioassayStudy("kept", { ASSAY_TYPE: dataset }),
                    bioassayStudy("notDownloadable", { ASSAY_TYPE: dataset, DOWNLOAD: 0 }),
                    bioassayStudy("otherAssayType", { ASSAY_TYPE: SYNERGIST }),
                    ...studiesRemovedByEachBioassayFilter(dataset),
                ];

                expect(survivingPrevention(studies, filters, "download")).toEqual(["kept"]);
            });

            it("ignores the Ministry of Health, mosquitoes and mortality filters of the map", () => {
                expect(survivingPrevention(notInMapChain(dataset), filters, "download")).toEqual([
                    "notMoH",
                    "fewMosquitoes",
                    "naMortality",
                ]);
            });
        });

        describe("SYNERGIST-INSECTICIDE_BIOASSAY", () => {
            const filters = bioassayFilters({ dataset: "SYNERGIST-INSECTICIDE_BIOASSAY" });

            it("removes a study for each filter of its chain", () => {
                const studies = [
                    bioassayStudy("kept", { ASSAY_TYPE: SYNERGIST }),
                    bioassayStudy("notDownloadable", { ASSAY_TYPE: SYNERGIST, DOWNLOAD: 0 }),
                    bioassayStudy("otherAssayType", { ASSAY_TYPE: DISCRIMINATING }),
                    bioassayStudy("otherTestType", { ASSAY_TYPE: SYNERGIST, TYPE: CDC_BOTTLE }),
                    bioassayStudy("otherSpecies", { ASSAY_TYPE: SYNERGIST, SPECIES: FUNESTUS }),
                    bioassayStudy("outsideYears", { ASSAY_TYPE: SYNERGIST, YEAR_START: OUTSIDE_YEAR }),
                    bioassayStudy("otherCountry", { ASSAY_TYPE: SYNERGIST, ...OTHER_COUNTRY }),
                ];

                expect(survivingPrevention(studies, filters, "download")).toEqual(["kept"]);
            });

            it("ignores the insecticide class and insecticide type filters", () => {
                const studies = [
                    bioassayStudy("otherClass", { ASSAY_TYPE: SYNERGIST, INSECTICIDE_CLASS: "ORGANOPHOSPHATES" }),
                    bioassayStudy("otherInsecticide", { ASSAY_TYPE: SYNERGIST, INSECTICIDE_TYPE: "PERMETHRIN" }),
                ];

                expect(survivingPrevention(studies, filters, "download")).toEqual(["otherClass", "otherInsecticide"]);
            });
        });

        describe("MOLECULAR_ASSAY", () => {
            const filters = bioassayFilters({ dataset: "MOLECULAR_ASSAY", type: ["GSTS"] });
            const molecularStudy = (code: string, overrides: Partial<PreventionStudy> = {}) =>
                bioassayStudy(code, { ASSAY_TYPE: MOLECULAR, TYPE: MONO_OXYGENASES, ...overrides });

            it("removes a study for each filter of its chain", () => {
                const studies = [
                    molecularStudy("kept"),
                    molecularStudy("notDownloadable", { DOWNLOAD: 0 }),
                    molecularStudy("synergistAssay", { ASSAY_TYPE: SYNERGIST }),
                    molecularStudy("otherSpecies", { SPECIES: FUNESTUS }),
                    molecularStudy("otherCountry", OTHER_COUNTRY),
                ];

                expect(survivingPrevention(studies, filters, "download")).toEqual(["kept"]);
            });

            it("keeps biochemical assays too", () => {
                const studies = [molecularStudy("biochemical", { ASSAY_TYPE: BIOCHEMICAL, TYPE: ESTERASES })];

                expect(survivingPrevention(studies, filters, "download")).toEqual(["biochemical"]);
            });

            it("keeps only MOLECULAR_MECHANISM_TYPES, which are the biochemical mechanisms, so kdr is removed (finding)", () => {
                const studies = [
                    molecularStudy("monoOxygenases", { TYPE: MONO_OXYGENASES }),
                    molecularStudy("esterases", { TYPE: ESTERASES }),
                    molecularStudy("gsts", { TYPE: "GSTS" }),
                    molecularStudy("kdr", { TYPE: "KDR_L1014S" }),
                    molecularStudy("ace1r", { TYPE: "ACE1R" }),
                ];

                expect(survivingPrevention(studies, filters, "download")).toEqual([
                    "monoOxygenases",
                    "esterases",
                    "gsts",
                ]);
            });

            it("ignores the selected type, and the year range (finding)", () => {
                const studies = [molecularStudy("outsideYears", { YEAR_START: OUTSIDE_YEAR })];

                expect(survivingPrevention(studies, filters, "download")).toEqual(["outsideYears"]);
            });
        });

        describe("BIOCHEMICAL_ASSAY", () => {
            const filters = bioassayFilters({ dataset: "BIOCHEMICAL_ASSAY", type: ["ACE1R"] });
            const biochemicalStudy = (code: string, overrides: Partial<PreventionStudy> = {}) =>
                bioassayStudy(code, { ASSAY_TYPE: BIOCHEMICAL, TYPE: "ACE1R", ...overrides });

            it("removes a study for each filter of its chain", () => {
                const studies = [
                    biochemicalStudy("kept"),
                    biochemicalStudy("notDownloadable", { DOWNLOAD: 0 }),
                    biochemicalStudy("otherSpecies", { SPECIES: FUNESTUS }),
                    biochemicalStudy("outsideYears", { YEAR_START: OUTSIDE_YEAR }),
                    biochemicalStudy("otherCountry", OTHER_COUNTRY),
                ];

                expect(survivingPrevention(studies, filters, "download")).toEqual(["kept"]);
            });

            it("keeps only BIOCHEMICAL_MECHANISM_TYPES, which are the molecular mechanisms (finding)", () => {
                const studies = [
                    biochemicalStudy("kdr", { TYPE: "KDR_L1014F" }),
                    biochemicalStudy("monoOxygenases", { TYPE: MONO_OXYGENASES }),
                ];

                expect(survivingPrevention(studies, filters, "download")).toEqual(["kdr"]);
            });

            it("does not filter by assay type, so a molecular assay is kept (finding)", () => {
                const studies = [biochemicalStudy("molecularAssay", { ASSAY_TYPE: MOLECULAR, TYPE: "KDR_L1014F" })];

                expect(survivingPrevention(studies, filters, "download")).toEqual(["molecularAssay"]);
            });

            it("ignores the selected type", () => {
                const studies = [biochemicalStudy("kdr", { TYPE: "KDR_L1014S" })];

                expect(survivingPrevention(studies, filters, "download")).toEqual(["kdr"]);
            });
        });

        it("an unknown dataset applies no filter", () => {
            const filters = bioassayFilters({ dataset: undefined });
            const studies = [bioassayStudy("notDownloadable", { DOWNLOAD: 0 }), ...notInMapChain(DISCRIMINATING)];

            expect(survivingPrevention(studies, filters, "download")).toEqual([
                "notDownloadable",
                "notMoH",
                "fewMosquitoes",
                "naMortality",
            ]);
        });
    });

    describe("download, invasive", () => {
        const studies = [
            createInvasiveStudy({ Code: "kept" }),
            createInvasiveStudy({ Code: "notDownloadable", MTM_DOWNLOAD: 0 }),
            createInvasiveStudy({ Code: "otherSpecies", VECTOR_SPECIES: "NR" }),
            createInvasiveStudy({ Code: "outsideYears", YEAR_START: OUTSIDE_YEAR }),
            createInvasiveStudy({ Code: "withoutYear", YEAR_START: undefined }),
            createInvasiveStudy({ Code: "otherCountry", ...OTHER_COUNTRY }),
        ];

        it("Vector occurrence adds the download flag to the map chain", () => {
            const filters = createInvasiveFilters({ vectorSpecies: ["AN_STEPHENSI_TYPE_FORM"] });

            expect(survivingInvasive(studies, filters, "download")).toEqual(["kept", "withoutYear"]);
        });

        it("an unknown map type filters by download flag and region only", () => {
            const filters = createInvasiveFilters({ mapType: 1, vectorSpecies: ["AN_STEPHENSI_TYPE_FORM"] });

            expect(survivingInvasive(studies, filters, "download")).toEqual([
                "kept",
                "otherSpecies",
                "outsideYears",
                "withoutYear",
            ]);
        });
    });
});
