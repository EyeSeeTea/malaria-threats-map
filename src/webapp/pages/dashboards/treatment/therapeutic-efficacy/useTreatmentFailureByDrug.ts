import React from "react";
import { TreatmentStudy } from "../../../../../domain/entities/TreatmentStudy";
import { getTreatmentFailure } from "../utils";
import { treatmentByDrugColors, TreatmentFailureSeriesItem } from "./types";
import { useTreatment } from "./useTreatment";

export function useTreatmentFailureByDrug() {
    const {
        filteredStudies,
        selectedCountries,
        filteredStudiesForDrugs,
        studiesCount,
        plasmodiumSpecies,
        drugs,
        molecularMarker,
        years,
        excludeLowerPatients,
        onPlasmodiumChange,
        onDrugsChange,
        onYearsChange,
        onExcludeLowerPatientsChange,
        onMolecularMarkerChange,
    } = useTreatment();

    const [data, setData] = React.useState<Record<string, TreatmentFailureSeriesItem[]>>({});

    React.useEffect(() => {
        setData(createChartData(filteredStudies, drugs, selectedCountries));
    }, [filteredStudies, drugs, selectedCountries]);

    return {
        filteredStudiesForDrugs,
        selectedCountries,
        studiesCount,
        data,
        plasmodiumSpecies,
        drugs,
        molecularMarker,
        years,
        excludeLowerPatients,
        onPlasmodiumChange,
        onDrugsChange,
        onYearsChange,
        onExcludeLowerPatientsChange,
        onMolecularMarkerChange,
    };
}

export function createChartData(
    studies: TreatmentStudy[],
    drugs: string[],
    countries: string[]
): Record<string, TreatmentFailureSeriesItem[]> {
    const getSeriesByDrug = (drug: string) => {
        const studiesByDrug = studies.filter(study => study.DRUG_NAME === drug);

        const failureLessThan10: TreatmentFailureSeriesItem = {
            type: "bar",
            color: treatmentByDrugColors[0],
            data: countries.map(country => {
                const studies = studiesByDrug.filter(
                    study => study.ISO2 === country && getTreatmentFailure(study) < 10
                );

                return studies.length;
            }),
            maxPointWidth: 15,
        };

        const failureMoreThan10: TreatmentFailureSeriesItem = {
            type: "bar",
            color: treatmentByDrugColors[1],
            data: countries.map(country => {
                const studies = studiesByDrug.filter(
                    study => study.ISO2 === country && getTreatmentFailure(study) > 10
                );

                return studies.length;
            }),
            maxPointWidth: 15,
        };

        return [failureMoreThan10, failureLessThan10];
    };

    return drugs.reduce(
        (acc, drug) => ({
            ...acc,
            [drug.replace("DRUG_", "")]: getSeriesByDrug(drug),
        }),
        {}
    );
}
