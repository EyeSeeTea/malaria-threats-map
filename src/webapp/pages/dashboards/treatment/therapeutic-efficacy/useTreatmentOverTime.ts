import i18next from "i18next";
import _ from "lodash";
import React from "react";
import { TreatmentStudy } from "../../../../../domain/entities/TreatmentStudy";
import { useDashboards } from "../../context/useDashboards";
import { useTreatmentFilters } from "../filters/useTreatmentFilters";
import { filterStudies } from "../utils";
import { BubleChartGroup, treatmentdashboardColors, TreatmentOverTimeType } from "./types";

export function useTreatmentOverTime(type: TreatmentOverTimeType) {
    const {
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
    } = useTreatmentFilters();

    const [filteredStudies, setFilteredStudies] = React.useState<TreatmentStudy[]>([]);
    const [series, setSeries] = React.useState<BubleChartGroup[]>([]);
    const { dashboardsTreatmentStudies } = useDashboards();

    const studiesCount = React.useMemo(() => filteredStudies.length, [filteredStudies]);

    React.useEffect(() => {
        const filteredStudies = filterStudies(
            dashboardsTreatmentStudies,
            plasmodiumSpecies,
            drugs,
            molecularMarker,
            years,
            excludeLowerPatients
        );

        setFilteredStudies(filteredStudies);
    }, [dashboardsTreatmentStudies, plasmodiumSpecies, drugs, molecularMarker, years, excludeLowerPatients]);

    React.useEffect(() => {
        setSeries(createTreatmentBubbleChartData(filteredStudies, type));
    }, [filteredStudies, type]);

    return {
        studiesCount,
        filteredStudies,
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
                };
            }),
        };
    });

    return series;
}
