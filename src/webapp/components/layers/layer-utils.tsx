import { Study } from "../../../domain/entities/Study";
import * as R from "ramda";
import { CountryProperties } from "../../../domain/entities/CountryLayer";

export const circleLayout = { visibility: "visible" };

export const studiesToGeoJson = (studies: Study[]) => ({
    type: "FeatureCollection",
    features: studies.map(study => ({
        id: study.OBJECTID,
        type: "Feature",
        properties: study,
        geometry: {
            type: "Point",
            coordinates: [parseFloat(study.Longitude), parseFloat(study.Latitude)],
        },
    })),
});

export const getCountryStudies = (studies: any[] = [], countriesProp: CountryProperties[], layerName: string) => {
    const countryStudies = R.groupBy(
        R.path<string>(["ISO2"]),
        studies
    );
    const countries = countriesProp
        .map((country, index) => ({
            ...country,
            OBJECTID: index,
            Latitude: country.CENTER_LAT,
            Longitude: country.CENTER_LON,
            STUDIES: (countryStudies[country.ISO_2_CODE] || []).length || 0,
        }))
        .filter(study => study.STUDIES !== 0);

    const sortedCountries = R.sortBy(country => country.STUDIES, countries);
    if (sortedCountries.length === 0) return [];
    
    const getCorrectSizeFunction = (studyNumber: number) => {
        let size;
        switch(layerName) {
            case "invasive": 
                size = invasivePreventionSize(studyNumber);
                break;
            case "prevention": 
                size = invasivePreventionSize(studyNumber);
                break;
            case "diagnosis": 
                size = diagnosisSize(studyNumber);
                break;
            case "treatment": 
                size = treatmentSize(studyNumber);
                break;
        }
        return size;
    };

    return countries.map(country => ({
        ...country,
        SIZE: getCorrectSizeFunction(country.STUDIES),
        SIZE_HOVER: getCorrectSizeFunction(country.STUDIES) - 1,
    }));
};

const invasivePreventionSize = (nStudies: number) => {
    if (nStudies > 50) {
        return 15;
    } else if (nStudies > 40) {
        return 12.5;
    } else if (nStudies > 30) {
        return 10;
    } else if (nStudies > 15) {
        return 7.5;
    } else if (nStudies >= 0) {
        return 5;
    }
};

const diagnosisSize = (nStudies: number) => {
    if (nStudies > 15) {
        return 15;
    } else if (nStudies > 10) {
        return 12.5;
    } else if (nStudies > 7) {
        return 10;
    } else if (nStudies > 5) {
        return 7.5;
    } else if (nStudies >= 0) {
        return 5;
    }
};

const treatmentSize = (nStudies: number) => {
    if (nStudies > 10) {
        return 15;
    } else if (nStudies > 8) {
        return 13;
    } else if (nStudies > 6) {
        return 11;
    } else if (nStudies > 4) {
        return 9;
    } else if (nStudies > 2) {
        return 7;
    } else if (nStudies >= 0) {
        return 5;
    }
};
