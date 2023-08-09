import _ from "lodash";
import * as R from "ramda";
import React from "react";
import { MolecularMarkerStudy, TreatmentStudy } from "../../../../../domain/entities/TreatmentStudy";
import { getMolecularMarkerStudies } from "../../../../components/layers/treatment/utils";
import { useTreatment } from "../useTreatment";
import { MolecularChart, MolecularChartSerie, molecularMarkerColors } from "./types";

export function useMolecularMarker() {
    const {
        filteredStudies,
        selectedCountries,
        filteredStudiesForDrugs,
        studiesCount,
        plasmodiumSpecies,
        drugs,
        molecularMarker,
        years,
        maxMinYears,
        excludeLowerSamples,
        onPlasmodiumChange,
        onDrugsChange,
        onYearsChange,
        onExcludeLowerSamplesChange,
        onMolecularMarkerChange,
    } = useTreatment(true);

    const [data, setData] = React.useState<MolecularChart>();

    React.useEffect(() => {
        onMolecularMarkerChange(1);
    }, [onMolecularMarkerChange]);

    React.useEffect(() => {
        setData(createChartData(filteredStudies, selectedCountries));
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
        maxMinYears,
        excludeLowerSamples,
        onPlasmodiumChange,
        onDrugsChange,
        onYearsChange,
        onExcludeLowerSamplesChange,
        onMolecularMarkerChange,
    };
}

export function createChartData(studies: TreatmentStudy[], countries: string[]): MolecularChart {
    const valueStudies = getMolecularMarkerStudies(studies);

    const sortedStudies = R.sortBy(study => -parseInt(study.YEAR_START), valueStudies);
    const years = _.uniq(sortedStudies.map(study => parseInt(study.YEAR_START)).sort());

    const getSeriesByCountry = (country: string) => {
        const studiesByCountry = valueStudies.filter(study => study.ISO2 === country);

        const proportionLessThan10: MolecularChartSerie = {
            type: "column",
            name: "<10% of samples",
            color: molecularMarkerColors[0],
            data: years.map(year => {
                const studies = studiesByCountry.filter(
                    study => +study.YEAR_START === year && getMolecularProportion(study) < 10
                );

                return studies.length;
            }),
            pointWidth: 20,
        };

        const proportion1050: MolecularChartSerie = {
            type: "column",
            name: "10-50% of samples",
            color: molecularMarkerColors[1],
            data: years.map(year => {
                const studies = studiesByCountry.filter(
                    study =>
                        +study.YEAR_START === year &&
                        getMolecularProportion(study) >= 10 &&
                        getMolecularProportion(study) <= 50
                );

                return studies.length;
            }),
            pointWidth: 20,
        };

        const proportion5180: MolecularChartSerie = {
            type: "column",
            name: "51-80% of samples",
            color: molecularMarkerColors[2],
            data: years.map(year => {
                const studies = studiesByCountry.filter(
                    study =>
                        +study.YEAR_START === year &&
                        getMolecularProportion(study) >= 51 &&
                        getMolecularProportion(study) <= 80
                );

                return studies.length;
            }),
            pointWidth: 20,
        };

        const proportionMoreThan80: MolecularChartSerie = {
            type: "column",
            name: ">80% of samples",
            color: molecularMarkerColors[3],
            data: years.map(year => {
                const studies = studiesByCountry.filter(
                    study => +study.YEAR_START === year && getMolecularProportion(study) > 80
                );

                return studies.length;
            }),
            pointWidth: 20,
        };

        return [proportionMoreThan80, proportion5180, proportion1050, proportionLessThan10];
    };

    return {
        years,
        seriesByCountry: countries.reduce(
            (acc, country) => ({
                ...acc,
                [country]: getSeriesByCountry(country),
            }),
            {}
        ),
    };
}

export function getMolecularProportion(study: MolecularMarkerStudy) {
    return parseFloat((study.VALUE * 100).toFixed(1));
}
