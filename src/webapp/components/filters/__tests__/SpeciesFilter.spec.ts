import { createPreventionStudy } from "../../../../domain/entities/__fixtures__/studyFixtures";
import { PreventionStudy } from "../../../../domain/entities/PreventionStudy";
import { createPreventionFilters } from "../../../store/__fixtures__/filtersFixtures";
import { PreventionFilters, PreventionMapType, RegionState } from "../../../store/types";
import { getSpeciesFilterOptions } from "../SpeciesFilter";

const YEARS = [2018, 2022];
const REGION: RegionState = { country: "BF" };

const GAMBIAE = "An. gambiae s.l.";
const FUNESTUS = "An. funestus s.l.";
const ARABIENSIS = "An. arabiensis";
const PYRETHROIDS = "PYRETHROIDS";
const DELTAMETHRIN = "DELTAMETHRIN";
const WHO_TEST_KIT = "WHO_TEST_KIT_ADULTS";
const CDC_BOTTLE = "CDC_BOTTLE_ADULTS";
const MONO_OXYGENASES = "MONO_OXYGENASES";
const MOLECULAR = "MOLECULAR_ASSAY";

function speciesOptions(studies: PreventionStudy[], filters: PreventionFilters): ReadonlyArray<string> {
    return getSpeciesFilterOptions(filters, studies, YEARS, REGION).map(option => option.value);
}

/** A study that passes every filter the cascades set, with the given species. */
function speciesStudy(species: string, overrides: Partial<PreventionStudy> = {}): PreventionStudy {
    return createPreventionStudy({
        SPECIES: species,
        INSECTICIDE_CLASS: PYRETHROIDS,
        INSECTICIDE_TYPE: DELTAMETHRIN,
        TYPE: WHO_TEST_KIT,
        PROXY_TYPE: MONO_OXYGENASES,
        ASSAY_TYPE: MOLECULAR,
        YEAR_START: 2020,
        ...overrides,
    });
}

describe("getSpeciesFilterOptions", () => {
    it("returns each species once, sorted, with the species as label and value", () => {
        const studies = [speciesStudy(GAMBIAE), speciesStudy(ARABIENSIS), speciesStudy(GAMBIAE)];
        const filters = createPreventionFilters({ mapType: PreventionMapType.RESISTANCE_STATUS });

        expect(getSpeciesFilterOptions(filters, studies, YEARS, REGION)).toEqual([
            { label: ARABIENSIS, value: ARABIENSIS },
            { label: GAMBIAE, value: GAMBIAE },
        ]);
    });

    describe.each([PreventionMapType.RESISTANCE_STATUS, PreventionMapType.INTENSITY_STATUS])(
        "bioassay map type %s",
        mapType => {
            const filters = createPreventionFilters({
                mapType,
                insecticideClass: PYRETHROIDS,
                insecticideTypes: [DELTAMETHRIN],
                type: [WHO_TEST_KIT],
                species: [GAMBIAE],
                onlyByHealthMinistries: true,
                onlyIncludeBioassaysWithMoreMosquitoes: 50,
            });

            it("is narrowed by insecticide class, insecticide type, test type, years and region", () => {
                const studies = [
                    speciesStudy(GAMBIAE),
                    speciesStudy("otherClass", { INSECTICIDE_CLASS: "ORGANOPHOSPHATES" }),
                    speciesStudy("otherInsecticide", { INSECTICIDE_TYPE: "PERMETHRIN" }),
                    speciesStudy("otherTestType", { TYPE: CDC_BOTTLE }),
                    speciesStudy("outsideYears", { YEAR_START: 2015 }),
                    speciesStudy("otherCountry", { ISO2: "IN", COUNTRY_NAME: "India" }),
                ];

                expect(speciesOptions(studies, filters)).toEqual([GAMBIAE]);
            });

            it("is not narrowed by the species filter itself", () => {
                expect(speciesOptions([speciesStudy(GAMBIAE), speciesStudy(FUNESTUS)], filters)).toEqual([
                    FUNESTUS,
                    GAMBIAE,
                ]);
            });

            it("is not narrowed by Ministry of Health, mosquitoes, mortality or intensity, unlike the map chain", () => {
                const studies = [
                    speciesStudy("notMoH", { INSTITUTION_TYPE: "Research" }),
                    speciesStudy("fewMosquitoes", { NUMBER: "20" }),
                    speciesStudy("naMortality", { MORTALITY_ADJUSTED: "NA" }),
                    speciesStudy("naIntensity", { RESISTANCE_INTENSITY: "NA" }),
                ];

                expect(speciesOptions(studies, filters)).toEqual([
                    "fewMosquitoes",
                    "naIntensity",
                    "naMortality",
                    "notMoH",
                ]);
            });
        }
    );

    describe("Resistance mechanisms", () => {
        const filters = createPreventionFilters({
            mapType: PreventionMapType.RESISTANCE_MECHANISM,
            insecticideClass: PYRETHROIDS,
            type: [WHO_TEST_KIT],
            assayTypes: [MOLECULAR],
            species: [GAMBIAE],
            synergistTypes: [CDC_BOTTLE],
        });

        it("is narrowed by mechanism type, assay type, years and region", () => {
            const studies = [
                speciesStudy(GAMBIAE),
                speciesStudy("otherMechanism", { TYPE: CDC_BOTTLE }),
                speciesStudy("otherAssayType", { ASSAY_TYPE: "BIOCHEMICAL_ASSAY" }),
                speciesStudy("outsideYears", { YEAR_START: 2015 }),
                speciesStudy("otherCountry", { ISO2: "IN", COUNTRY_NAME: "India" }),
            ];

            expect(speciesOptions(studies, filters)).toEqual([GAMBIAE]);
        });

        it("is not narrowed by the species filter, the insecticide class or the synergist types", () => {
            const studies = [
                speciesStudy(FUNESTUS),
                speciesStudy("otherClass", { INSECTICIDE_CLASS: "ORGANOPHOSPHATES" }),
            ];

            expect(speciesOptions(studies, filters)).toEqual([FUNESTUS, "otherClass"]);
        });
    });

    describe("Level of involvement", () => {
        const filters = createPreventionFilters({
            mapType: PreventionMapType.LEVEL_OF_INVOLVEMENT,
            proxyType: MONO_OXYGENASES,
            synergistTypes: [WHO_TEST_KIT],
            insecticideClass: PYRETHROIDS,
            insecticideTypes: [DELTAMETHRIN],
            species: [GAMBIAE],
        });

        it("is narrowed by proxy type, synergist type, years and region", () => {
            const studies = [
                speciesStudy(GAMBIAE),
                speciesStudy("otherProxyType", { PROXY_TYPE: "ESTERASES" }),
                speciesStudy("otherSynergistType", { TYPE: CDC_BOTTLE }),
                speciesStudy("outsideYears", { YEAR_START: 2015 }),
                speciesStudy("otherCountry", { ISO2: "IN", COUNTRY_NAME: "India" }),
            ];

            expect(speciesOptions(studies, filters)).toEqual([GAMBIAE]);
        });

        it("is not narrowed by insecticide class and type, unlike the map chain", () => {
            const studies = [
                speciesStudy("otherClass", { INSECTICIDE_CLASS: "ORGANOPHOSPHATES" }),
                speciesStudy("otherInsecticide", { INSECTICIDE_TYPE: "PERMETHRIN" }),
            ];

            expect(speciesOptions(studies, filters)).toEqual(["otherClass", "otherInsecticide"]);
        });
    });
});
