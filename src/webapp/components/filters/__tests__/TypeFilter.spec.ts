import { createPreventionStudy } from "../../../../domain/entities/__fixtures__/studyFixtures";
import { PreventionStudy } from "../../../../domain/entities/PreventionStudy";
import { createPreventionFilters } from "../../../store/__fixtures__/filtersFixtures";
import { PreventionFilters, PreventionMapType, RegionState } from "../../../store/types";
import { getTypeFilterOptions } from "../TypeFilter";
import {
    BIOCHEMICAL,
    CDC_BOTTLE,
    DELTAMETHRIN,
    ESTERASES,
    FUNESTUS,
    GAMBIAE,
    MOLECULAR,
    MONO_OXYGENASES,
    ORGANOPHOSPHATES,
    OTHER_COUNTRY,
    PERMETHRIN,
    PYRETHROIDS,
    RESEARCH_INSTITUTION,
    WHO_TEST_KIT,
} from "../../../../domain/entities/__fixtures__/studyValues";

const OUTSIDE_YEARS = "outsideYears";
const OTHER_COUNTRY_STUDY = "otherCountry";
const OTHER_SPECIES = "otherSpecies";
const NOT_MOH = "notMoH";
const FEW_MOSQUITOES = "fewMosquitoes";
const PROXY_ONLY_TYPE = "proxyOnlyType";

const YEARS = [2018, 2022];
const REGION: RegionState = { country: "BF" };

function typeOptions(studies: PreventionStudy[], filters: PreventionFilters): ReadonlyArray<string> {
    return getTypeFilterOptions(filters, studies, YEARS, REGION).map(option => option.value);
}

/** A study that passes every filter the cascades set, with the given type. */
function typeStudy(type: string, overrides: Partial<PreventionStudy> = {}): PreventionStudy {
    return createPreventionStudy({
        TYPE: type,
        SPECIES: GAMBIAE,
        INSECTICIDE_CLASS: PYRETHROIDS,
        INSECTICIDE_TYPE: DELTAMETHRIN,
        PROXY_TYPE: MONO_OXYGENASES,
        ASSAY_TYPE: MOLECULAR,
        YEAR_START: 2020,
        ...overrides,
    });
}

describe("getTypeFilterOptions", () => {
    it("returns each type once, in the order of the studies, not sorted", () => {
        const studies = [typeStudy(WHO_TEST_KIT), typeStudy(CDC_BOTTLE), typeStudy(WHO_TEST_KIT)];
        const filters = createPreventionFilters({ mapType: PreventionMapType.RESISTANCE_STATUS });

        expect(getTypeFilterOptions(filters, studies, YEARS, REGION)).toEqual([
            { label: WHO_TEST_KIT, value: WHO_TEST_KIT },
            { label: CDC_BOTTLE, value: CDC_BOTTLE },
        ]);
    });

    // Possibly a bug: a study without TYPE offers an empty test type in the filter (finding).
    it("offers a null option for a study whose TYPE is null", () => {
        const studies = [typeStudy(WHO_TEST_KIT), typeStudy(null)];
        const filters = createPreventionFilters({ mapType: PreventionMapType.RESISTANCE_STATUS });

        expect(getTypeFilterOptions(filters, studies, YEARS, REGION)).toEqual([
            { label: WHO_TEST_KIT, value: WHO_TEST_KIT },
            { label: null, value: null },
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

            it("is narrowed by insecticide class, insecticide type, years and region", () => {
                const studies = [
                    typeStudy(WHO_TEST_KIT),
                    typeStudy("otherClass", { INSECTICIDE_CLASS: ORGANOPHOSPHATES }),
                    typeStudy("otherInsecticide", { INSECTICIDE_TYPE: PERMETHRIN }),
                    typeStudy(OUTSIDE_YEARS, { YEAR_START: 2015 }),
                    typeStudy(OTHER_COUNTRY_STUDY, OTHER_COUNTRY),
                ];

                expect(typeOptions(studies, filters)).toEqual([WHO_TEST_KIT]);
            });

            it("is not narrowed by the test type filter itself", () => {
                expect(typeOptions([typeStudy(WHO_TEST_KIT), typeStudy(CDC_BOTTLE)], filters)).toEqual([
                    WHO_TEST_KIT,
                    CDC_BOTTLE,
                ]);
            });

            it("is not narrowed by species, Ministry of Health or mosquitoes, unlike the map chain", () => {
                const studies = [
                    typeStudy(OTHER_SPECIES, { SPECIES: FUNESTUS }),
                    typeStudy(NOT_MOH, { INSTITUTION_TYPE: RESEARCH_INSTITUTION }),
                    typeStudy(FEW_MOSQUITOES, { NUMBER: "20" }),
                ];

                expect(typeOptions(studies, filters)).toEqual([OTHER_SPECIES, NOT_MOH, FEW_MOSQUITOES]);
            });
        }
    );

    describe("Resistance mechanisms", () => {
        const filters = createPreventionFilters({
            mapType: PreventionMapType.RESISTANCE_MECHANISM,
            assayTypes: [MOLECULAR],
            type: [MONO_OXYGENASES],
            species: [GAMBIAE],
        });

        it("is narrowed by assay type, years and region", () => {
            const studies = [
                typeStudy(MONO_OXYGENASES),
                typeStudy("otherAssayType", { ASSAY_TYPE: BIOCHEMICAL }),
                typeStudy(OUTSIDE_YEARS, { YEAR_START: 2015 }),
                typeStudy(OTHER_COUNTRY_STUDY, OTHER_COUNTRY),
            ];

            expect(typeOptions(studies, filters)).toEqual([MONO_OXYGENASES]);
        });

        it("is not narrowed by the type filter itself or by species", () => {
            const studies = [typeStudy(ESTERASES), typeStudy(OTHER_SPECIES, { SPECIES: FUNESTUS })];

            expect(typeOptions(studies, filters)).toEqual([ESTERASES, OTHER_SPECIES]);
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

        it("is narrowed by synergist type, which reads TYPE, so only the selected synergist types are offered", () => {
            const studies = [typeStudy(WHO_TEST_KIT), typeStudy(CDC_BOTTLE)];

            expect(typeOptions(studies, filters)).toEqual([WHO_TEST_KIT]);
        });

        it("is narrowed by years and region", () => {
            const studies = [
                typeStudy(OUTSIDE_YEARS, { YEAR_START: 2015 }),
                typeStudy(OTHER_COUNTRY_STUDY, OTHER_COUNTRY),
            ];

            expect(typeOptions(studies, filters)).toEqual([]);
        });

        it("is not narrowed by proxy type, insecticide class and type, or species, unlike the map chain", () => {
            const filtersOfferingBoth = { ...filters, synergistTypes: [WHO_TEST_KIT, PROXY_ONLY_TYPE] };
            const studies = [
                typeStudy(PROXY_ONLY_TYPE, { PROXY_TYPE: ESTERASES }),
                typeStudy(WHO_TEST_KIT, { INSECTICIDE_CLASS: ORGANOPHOSPHATES, SPECIES: FUNESTUS }),
            ];

            expect(typeOptions(studies, filtersOfferingBoth)).toEqual([PROXY_ONLY_TYPE, WHO_TEST_KIT]);
        });
    });
});
