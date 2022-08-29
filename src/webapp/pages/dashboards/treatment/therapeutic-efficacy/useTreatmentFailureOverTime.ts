import i18next from "i18next";
import _ from "lodash";
import React from "react";
import { Study } from "../../../../../domain/entities/Study";
import { TreatmentStudy } from "../../../../../domain/entities/TreatmentStudy";
import {
    filterByDrugs,
    filterByExcludeLowerPatients,
    filterByMolecularMarker,
    filterByPlasmodiumSpecies,
    filterByYearRange,
} from "../../../../components/layers/studies-filters";
import { useDashboards } from "../../context/useDashboards";
import { useTreatmentFilters } from "../filters/useTreatmentFilters";

const colors = ["#7EA0C3", "#FEAF59", "#F78185", "#94CFCA", "#7BC280"];

export type BubleChartGroup = {
    type: "bubble";
    name: string;
    color: string;
    data: BubleChartItem[];
};

type BubleChartItem = {
    x: number; //year
    y: number; //treatment failure
    z: number; //number patients
};

export function useTreatmentFailureOverTime() {
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
        setSeries(createTreatmentFailureChartData(filteredStudies));
    }, [filteredStudies]);

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

function filterStudies(
    studies: Study[],
    plasmodiumSpecies: string,
    drugs: string[],
    molecularMarker: number,
    years: [number, number],
    excludeLowerPatients: boolean
): TreatmentStudy[] {
    const filters = [
        filterByPlasmodiumSpecies(plasmodiumSpecies),
        filterByDrugs(drugs),
        filterByYearRange(years),
        filterByMolecularMarker(molecularMarker),
        filterByExcludeLowerPatients(excludeLowerPatients),
    ];

    const filteredStudies = filters.reduce((studies, filter) => studies.filter(filter), studies);

    return filteredStudies as unknown as TreatmentStudy[];
}

function createTreatmentFailureChartData(studies: TreatmentStudy[]): BubleChartGroup[] {
    const countries = _.uniq(studies.map(study => study.ISO2));

    const series = countries.map((iso2, index) => {
        const studiesByCountry = studies.filter(study => study.ISO2 === iso2);

        console.log({ studiesByCountry });

        return {
            type: "bubble" as const,
            name: i18next.t(iso2),
            color: index <= colors.length - 1 ? colors[index] : "#000000",
            data: studiesByCountry.map(study => ({
                x: +study.YEAR_START,
                y: +study.TREATMENT_FAILURE_PP || +study.TREATMENT_FAILURE_PP || -1,
                z: +study.N,
            })),
        };
    });

    console.log({ series });

    return series;
}
