import React from "react";
import { TreatmentStudy } from "../../../../../domain/entities/TreatmentStudy";
import { getTreatmentFailure } from "../utils";
import { treatmentByDrugColors, TreatmentFailureSeries, TreatmentFailureSeriesItem } from "./types";
import { useTreatment } from "../useTreatment";
import { TreatmentFiltersState } from "../filters/TreatmentFiltersState";

export function useTreatmentFailureByDrug() {
    const { filteredStudies, selectedCountries, filteredStudiesForDrugs, studiesCount, filters } = useTreatment(true);

    const [data, setData] = React.useState<TreatmentFailureSeries>({ maxYAxis: 0, itemsByDrug: {} });

    React.useEffect(() => {
        setData(createChartData(filteredStudies, filters.drugs || [], selectedCountries));
    }, [filteredStudies, filters.drugs, selectedCountries]);

    return {
        filteredStudiesForDrugs,
        selectedCountries,
        studiesCount,
        data,
        filters: { ...filters, onChangeShowDataForAllCountries: undefined } as TreatmentFiltersState,
    };
}

export function createChartData(
    studies: TreatmentStudy[],
    drugs: string[],
    countries: string[]
): TreatmentFailureSeries {
    const getSeriesByDrug = (drug: string) => {
        const studiesByDrug = studies.filter(study => study.DRUG_NAME === drug);
        const maxPointWidth = 15;

        const failureLessThan10: TreatmentFailureSeriesItem = {
            type: "bar",
            color: treatmentByDrugColors[0],
            data: countries.map(country => {
                const studies = studiesByDrug.filter(
                    study => study.ISO2 === country && getTreatmentFailure(study) < 10
                );

                return studies.length;
            }),
            maxPointWidth,
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
            maxPointWidth,
        };

        return [failureMoreThan10, failureLessThan10];
    };

    const itemsByDrug: Record<string, TreatmentFailureSeriesItem[]> = drugs.reduce(
        (acc, drug) => ({
            ...acc,
            [drug.replace("DRUG_", "")]: getSeriesByDrug(drug),
        }),
        {}
    );

    const maxYAxis = getMaxYAxis(itemsByDrug);

    return { maxYAxis, itemsByDrug };
}

function getMaxYAxis(itemsByDrug: Record<string, TreatmentFailureSeriesItem[]>) {
    return Object.keys(itemsByDrug).reduce((acc, currentDrug) => {
        const drugData = itemsByDrug[currentDrug];

        const failureMoreThan10 = drugData[0];
        const failureLessThan10 = drugData[1];

        const sumFailures = failureMoreThan10.data.map(
            (dataByCountry, index) => dataByCountry + failureLessThan10.data[index]
        );

        const maxByDrug = Math.max(...sumFailures);

        return acc > maxByDrug ? acc : maxByDrug;
    }, 0);
}
