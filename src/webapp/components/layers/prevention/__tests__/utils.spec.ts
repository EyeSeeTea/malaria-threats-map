import { PreventionStudy } from "../../../../../domain/entities/PreventionStudy";
import {
    filterByCriteria1,
    filterByCriteria3,
    getMostRecentByCriteria1,
    getMostRecentByCriteria2,
    getMostRecentByCriteria3,
} from "../utils";

describe("Prevention Pbo studies", () => {
    describe("filterByCriteria1", () => {
        it("should return empty studies if any studies meet filter by criteria", () => {
            const studies = givenAStudiesByCriteria1({ totalStudies: 5, meetFiltersCount: 0 });

            const filteredStudies = filterByCriteria1(studies);

            expect(filteredStudies.length).toEqual(0);
        });
        it("should return two studies if two studies meet filter by criteria", () => {
            const studies = givenAStudiesByCriteria1({ totalStudies: 5, meetFiltersCount: 2 });

            const filteredStudies = filterByCriteria1(studies);

            expect(filteredStudies.length).toEqual(2);
        });
    });
    describe("getMostRecentByCriteria1", () => {
        it("should return most recent if there are not studies in last tree years ", () => {
            const studies = givenAStudiesByCriteria1({
                totalStudies: 5,
                meetFiltersCount: 2,
                years: [new Date().getFullYear() - 4, new Date().getFullYear() - 5],
            });

            const filteredStudies = filterByCriteria1(studies);
            const mostRecent = getMostRecentByCriteria1(filteredStudies);

            expect(+mostRecent.YEAR_START).toEqual(new Date().getFullYear() - 4);
            expect(+mostRecent.MORTALITY_ADJUSTED).toBeLessThanOrEqual(0.9);
        });
        it("should return most recent if there are studies in last tree years ", () => {
            const studies = givenAStudiesByCriteria1({
                totalStudies: 5,
                meetFiltersCount: 2,
                years: [new Date().getFullYear() - 1, new Date().getFullYear() - 2],
            });

            const filteredStudies = filterByCriteria1(studies);
            const mostRecent = getMostRecentByCriteria1(filteredStudies);

            expect(+mostRecent.YEAR_START).toEqual(new Date().getFullYear() - 1);
            expect(+mostRecent.MORTALITY_ADJUSTED).toBeLessThanOrEqual(0.9);
        });
    });
    describe("getMostRecentByCriteria2", () => {
        it("should return most recent if there are not studies in last tree years ", () => {
            const studies = givenAStudiesByCriteria2({
                totalStudies: 5,
                meetFiltersCount: 2,
                years: [new Date().getFullYear() - 4, new Date().getFullYear() - 5],
            });

            const filteredStudies = filterByCriteria1(studies);
            const mostRecent = getMostRecentByCriteria2(filteredStudies);

            expect(+mostRecent.YEAR_START).toEqual(new Date().getFullYear() - 4);
            expect(+mostRecent.MORTALITY_ADJUSTED).toBeGreaterThan(0.1);
            expect(+mostRecent.MORTALITY_ADJUSTED).toBeLessThanOrEqual(0.8);
        });
        it("should return most recent if there are studies in last tree years ", () => {
            const studies = givenAStudiesByCriteria2({
                totalStudies: 5,
                meetFiltersCount: 2,
                years: [new Date().getFullYear() - 1, new Date().getFullYear() - 2],
            });

            const filteredStudies = filterByCriteria1(studies);
            const mostRecent = getMostRecentByCriteria2(filteredStudies);

            expect(+mostRecent.YEAR_START).toEqual(new Date().getFullYear() - 1);
            expect(+mostRecent.MORTALITY_ADJUSTED).toBeGreaterThan(0.1);
            expect(+mostRecent.MORTALITY_ADJUSTED).toBeLessThanOrEqual(0.8);
        });
    });
    describe("filterByCriteria3", () => {
        it("should return empty studies if any studies meet filter by criteria", () => {
            const studies = givenAStudiesByCriteria3({ totalStudies: 5, meetFiltersCount: 0 });

            const filteredStudies = filterByCriteria3(studies);

            expect(filteredStudies.length).toEqual(0);
        });
        it("should return two studies if two studies meet filter by criteria", () => {
            const studies = givenAStudiesByCriteria3({ totalStudies: 5, meetFiltersCount: 2 });

            const filteredStudies = filterByCriteria3(studies);

            expect(filteredStudies.length).toEqual(2);
        });
    });
    describe("getMostRecentByCriteria3", () => {
        it("should return most recent", () => {
            const studies = givenAStudiesByCriteria3({
                totalStudies: 5,
                meetFiltersCount: 2,
                years: [new Date().getFullYear() - 1, new Date().getFullYear() - 2],
            });

            const filteredStudies = filterByCriteria3(studies);
            const mostRecent = getMostRecentByCriteria3(filteredStudies);

            expect(+mostRecent.YEAR_START).toEqual(new Date().getFullYear() - 1);
            expect(mostRecent.MECHANISM_STATUS).toEqual("DETECTED");
        });
    });
});

interface params {
    totalStudies: number;
    meetFiltersCount: number;
    years?: number[];
}

function givenAStudiesByCriteria1({ totalStudies, meetFiltersCount, years }: params): PreventionStudy[] {
    const criteriaAssayType = "DISCRIMINATING_CONCENTRATION_BIOASSAY";
    const criteriaInsecticideClass = "PYRETHROIDS";
    const criteriaMortalityAjusted = "0.85";

    const dataList = Array.from(Array(totalStudies).keys()).map((_, index) => {
        const meetFilters = index + 1 <= meetFiltersCount;

        const studyTemplate: PreventionStudy = {
            OBJECTID: index,
            Code: "GIL0222",
            COUNTRY_NAME: "DEMOCRATIC_REPUBLIC_OF_THE_CONGO",
            ISO2: "CD",
            REGION_FULL: "AFRICA",
            SUBREGION: "AFRICA_CENTRAL_SUB-REGION",
            Latitude: "-4.404957",
            Longitude: "15.371885",
            MALARIA_ENDEMIC: 1,
            SITE_ID: "IRCD19",
            YEAR_START: years && years.length > index ? years[index].toString() : new Date().getFullYear().toString(),
            INVESTIGATION_TYPE: "PHENOTYPIC",
            ASSAY_TYPE: meetFilters ? criteriaAssayType : "N/A",
            INSECTICIDE_TYPE: "ALPHACYPERMETHRIN",
            INSECTICIDE_INTENSITY: "1",
            SYNERGIST_TYPE: "NA",
            MONTH_START: "JANUARY",
            VILLAGE_NAME: "Kingasani",
            SPECIES: "An. gambiae s.l.",
            MORTALITY_ADJUSTED: meetFilters ? criteriaMortalityAjusted : "0",
            RESISTANCE_STATUS: "CONFIRMED_RESISTANCE",
            MECHANISM_STATUS: "NA",
            MECHANISM_FREQUENCY: "NA",
            INSTITUTE: "Institute National de Recherche Biomédicale (INRB)",
            INSECTICIDE_CLASS: meetFilters ? criteriaInsecticideClass : "N/A",
            METHOD_STANDARD: 1,
            RESISTANCE_INTENSITY: "NA",
            MECHANISM_PROXY: "NA",
            PROXY_TYPE: "NA",
            INSECTICIDE_CONC: "0.05%",
            SYNERGIST_CONC: "NA",
            RESISTANCE_STATUS_NUMERIC: 1,
            MONTH_END: "AUGUST",
            TYPE: "WHO_TEST_KIT_ADULTS",
            NUMBER: "100",
            TIME: "24HRS",
            STAGE_ORIGIN: "F0_ADULTS_(FROM_WILD_LARVAE)",
            TYPE_SYNERGIST: "NA",
            YEAR_END: "2018",
            VERSION: 2,
            CITATION_LONG: "NA",
            RESISTANCE_FREQUENCY: "  NA",
            CITATION_URL: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7193383/",
            STUDY_PAIRING_CODE: "NA",
            INSTITUTE_CURATION: "World Health Organization",
            ADMIN1: "Kinshasa",
            ADMIN1_GUID: "172e79fe-d510-467c-8b7a-24ceb7af1109",
            ADMIN2: "Ndjili",
            ADMIN2_GUID: "0023d002-94e3-4a1e-9119-4020f31d0bcd",
            SITE_NAME: "",
            CURATION: "",
            CITATION: "",
        };

        return studyTemplate;
    });

    return dataList;
}

function givenAStudiesByCriteria2({ totalStudies, meetFiltersCount, years }: params): PreventionStudy[] {
    const criteriaAssayType = "DISCRIMINATING_CONCENTRATION_BIOASSAY";
    const criteriaInsecticideClass = "PYRETHROIDS";
    const criteriaMortalityAjusted = "0.5";

    const dataList = Array.from(Array(totalStudies).keys()).map((_, index) => {
        const meetFilters = index + 1 <= meetFiltersCount;

        const studyTemplate: PreventionStudy = {
            OBJECTID: index,
            Code: "GIL0222",
            COUNTRY_NAME: "DEMOCRATIC_REPUBLIC_OF_THE_CONGO",
            ISO2: "CD",
            REGION_FULL: "AFRICA",
            SUBREGION: "AFRICA_CENTRAL_SUB-REGION",
            Latitude: "-4.404957",
            Longitude: "15.371885",
            MALARIA_ENDEMIC: 1,
            SITE_ID: "IRCD19",
            YEAR_START: years && years.length > index ? years[index].toString() : new Date().getFullYear().toString(),
            INVESTIGATION_TYPE: "PHENOTYPIC",
            ASSAY_TYPE: meetFilters ? criteriaAssayType : "N/A",
            INSECTICIDE_TYPE: "ALPHACYPERMETHRIN",
            INSECTICIDE_INTENSITY: "1",
            SYNERGIST_TYPE: "NA",
            MONTH_START: "JANUARY",
            VILLAGE_NAME: "Kingasani",
            SPECIES: "An. gambiae s.l.",
            MORTALITY_ADJUSTED: meetFilters ? criteriaMortalityAjusted : "0",
            RESISTANCE_STATUS: "CONFIRMED_RESISTANCE",
            MECHANISM_STATUS: "NA",
            MECHANISM_FREQUENCY: "NA",
            INSTITUTE: "Institute National de Recherche Biomédicale (INRB)",
            INSECTICIDE_CLASS: meetFilters ? criteriaInsecticideClass : "N/A",
            METHOD_STANDARD: 1,
            RESISTANCE_INTENSITY: "NA",
            MECHANISM_PROXY: "NA",
            PROXY_TYPE: "NA",
            INSECTICIDE_CONC: "0.05%",
            SYNERGIST_CONC: "NA",
            RESISTANCE_STATUS_NUMERIC: 1,
            MONTH_END: "AUGUST",
            TYPE: "WHO_TEST_KIT_ADULTS",
            NUMBER: "100",
            TIME: "24HRS",
            STAGE_ORIGIN: "F0_ADULTS_(FROM_WILD_LARVAE)",
            TYPE_SYNERGIST: "NA",
            YEAR_END: "2018",
            VERSION: 2,
            CITATION_LONG: "NA",
            RESISTANCE_FREQUENCY: "  NA",
            CITATION_URL: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7193383/",
            STUDY_PAIRING_CODE: "NA",
            INSTITUTE_CURATION: "World Health Organization",
            ADMIN1: "Kinshasa",
            ADMIN1_GUID: "172e79fe-d510-467c-8b7a-24ceb7af1109",
            ADMIN2: "Ndjili",
            ADMIN2_GUID: "0023d002-94e3-4a1e-9119-4020f31d0bcd",
            SITE_NAME: "",
            CURATION: "",
            CITATION: "",
        };

        return studyTemplate;
    });

    return dataList;
}

function givenAStudiesByCriteria3({ totalStudies, meetFiltersCount, years }: params): PreventionStudy[] {
    const criteriaType = "MONO_OXYGENASES";
    const criteriaAssayType = "BIOCHEMICAL_ASSAY";
    const criteriaMechanismStatus = "DETECTED";

    const dataList = Array.from(Array(totalStudies).keys()).map((_, index) => {
        const meetFilters = index + 1 <= meetFiltersCount;

        const studyTemplate: PreventionStudy = {
            OBJECTID: index,
            Code: "GIL0222",
            COUNTRY_NAME: "DEMOCRATIC_REPUBLIC_OF_THE_CONGO",
            ISO2: "CD",
            REGION_FULL: "AFRICA",
            SUBREGION: "AFRICA_CENTRAL_SUB-REGION",
            Latitude: "-4.404957",
            Longitude: "15.371885",
            MALARIA_ENDEMIC: 1,
            SITE_ID: "IRCD19",
            YEAR_START: years && years.length > index ? years[index].toString() : new Date().getFullYear().toString(),
            INVESTIGATION_TYPE: "PHENOTYPIC",
            ASSAY_TYPE: meetFilters ? criteriaAssayType : "N/A",
            INSECTICIDE_TYPE: "ALPHACYPERMETHRIN",
            INSECTICIDE_INTENSITY: "1",
            SYNERGIST_TYPE: "NA",
            MONTH_START: "JANUARY",
            VILLAGE_NAME: "Kingasani",
            SPECIES: "An. gambiae s.l.",
            MORTALITY_ADJUSTED: "0",
            RESISTANCE_STATUS: "CONFIRMED_RESISTANCE",
            MECHANISM_STATUS: meetFilters ? criteriaMechanismStatus : "NA",
            MECHANISM_FREQUENCY: "NA",
            INSTITUTE: "Institute National de Recherche Biomédicale (INRB)",
            INSECTICIDE_CLASS: "N/A",
            METHOD_STANDARD: 1,
            RESISTANCE_INTENSITY: "NA",
            MECHANISM_PROXY: "NA",
            PROXY_TYPE: "NA",
            INSECTICIDE_CONC: "0.05%",
            SYNERGIST_CONC: "NA",
            RESISTANCE_STATUS_NUMERIC: 1,
            MONTH_END: "AUGUST",
            TYPE: meetFilters ? criteriaType : "WHO_TEST_KIT_ADULTS",
            NUMBER: "100",
            TIME: "24HRS",
            STAGE_ORIGIN: "F0_ADULTS_(FROM_WILD_LARVAE)",
            TYPE_SYNERGIST: "NA",
            YEAR_END: "2018",
            VERSION: 2,
            CITATION_LONG: "NA",
            RESISTANCE_FREQUENCY: "  NA",
            CITATION_URL: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7193383/",
            STUDY_PAIRING_CODE: "NA",
            INSTITUTE_CURATION: "World Health Organization",
            ADMIN1: "Kinshasa",
            ADMIN1_GUID: "172e79fe-d510-467c-8b7a-24ceb7af1109",
            ADMIN2: "Ndjili",
            ADMIN2_GUID: "0023d002-94e3-4a1e-9119-4020f31d0bcd",
            SITE_NAME: "",
            CURATION: "",
            CITATION: "",
        };

        return studyTemplate;
    });

    return dataList;
}
