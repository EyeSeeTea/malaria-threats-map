import i18next from "i18next";
import _ from "lodash";
import React from "react";
import { TreatmentStudy } from "../../../../../domain/entities/TreatmentStudy";
import { BubleChartGroup, treatmentdashboardColors, TreatmentOverTimeType } from "./types";
import { useTreatment } from "../useTreatment";

export function useTreatmentOverTime(type: TreatmentOverTimeType) {
    const {
        filteredStudies,
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
    } = useTreatment(false);

    const [series, setSeries] = React.useState<BubleChartGroup[]>([]);

    React.useEffect(() => {
        setSeries(createTreatmentBubbleChartData(filteredStudies, type));
    }, [filteredStudies, type]);

    return {
        studiesCount,
        filteredStudiesForDrugs,
        series,
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

export function createTreatmentBubbleChartData(
    studies: TreatmentStudy[],
    type: TreatmentOverTimeType
): BubleChartGroup[] {
    const countries = _.uniq(studies.map(study => study.ISO2));

    const series = countries.map((iso2, index) => {
        const studiesByCountry = studies.filter(study => study.ISO2 === iso2);

        return {
            type: "bubble" as const,
            name: i18next.t(iso2),
            color: index <= treatmentdashboardColors.length - 1 ? treatmentdashboardColors[index] : "#000000",
            data: studiesByCountry.map(study => {
                const rawValue =
                    type === "treatmentFailure"
                        ? parseFloat(study.TREATMENT_FAILURE_PP) || parseFloat(study.TREATMENT_FAILURE_PP) || -1
                        : parseFloat(study.POSITIVE_DAY_3) || -1;

                // Remove weird 999.990
                const value = rawValue === 999.99 ? -1 : +(rawValue * 100).toFixed(2);

                return {
                    x: +study.YEAR_START,
                    y: value,
                    z: +study.N,
                    site: study.SITE_NAME,
                    country: study.COUNTRY_NAME,
                    drug: study.DRUG_NAME,
                };
            }),
        };
    });

    return series;
}
