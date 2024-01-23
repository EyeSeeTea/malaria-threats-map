import { range, countBy, uniq } from "lodash";
import React from "react";

import { usePrevention } from "../../usePrevention";
import { SpreadOfResistanceOverTimeChartDataByType } from "../types";
import { createBarChartData } from "./bar-chart/createBarChartData";
import { createLineChartData } from "./line-chart/createLineChartData";
import { PreventionFiltersState } from "../../filters/PreventionFiltersState";

const baseFilters: ((study: any) => boolean)[] = [];

export function useSpreadResistanceOverTimeByInsecticide() {
    const { preventionStudies, filteredStudies, selectedCountries, filters } = usePrevention(baseFilters);

    const { disaggregateBySpeciesSelection, years, onInsecticideClassChange } = filters;

    const [lineChartDataByType, setLineChartDataByType] = React.useState<SpreadOfResistanceOverTimeChartDataByType>({
        kind: "InsecticideByType",
        data: { years: [], dataByCountry: {}, maxValue: 0 },
    });

    const [barChartDataByType, setBarChartDataByType] = React.useState<SpreadOfResistanceOverTimeChartDataByType>({
        kind: "InsecticideByType",
        data: { years: [], dataByCountry: {}, maxValue: 0 },
    });

    const [categoriesCountByInsecticide, setCategoriesCountByInsecticide] = React.useState<Record<string, number>>({});
    const [chartByInsecticide, setChartByInsecticide] = React.useState<"by-insecticide" | undefined>(undefined);
    const [allInsecticides, setAllInsecticides] = React.useState<string[]>([]);
    const [multipleSelectedInsecticides, setMultipleSelectedInsecticides] = React.useState<string[]>([]);
    const [singleSelectedInsecticide, setSingleSelectedInsecticide] = React.useState<string | undefined>(undefined);

    const filteredStudiesWithoutNAInsecticideClassStudies = React.useMemo(
        () => filteredStudies.filter(study => study.INSECTICIDE_CLASS !== "NA"),
        [filteredStudies]
    );

    React.useEffect(() => {
        if (chartByInsecticide) {
            onInsecticideClassChange(["PYRETHROIDS"]);
        }
    }, [chartByInsecticide, onInsecticideClassChange]);

    React.useEffect(() => {
        const insecticides = uniq(
            preventionStudies.filter(study => study.INSECTICIDE_CLASS !== "NA").map(study => study.INSECTICIDE_TYPE)
        ).sort();
        setAllInsecticides(insecticides);
        setMultipleSelectedInsecticides(insecticides);
        setSingleSelectedInsecticide(insecticides[0]);
    }, [preventionStudies]);

    React.useEffect(() => {
        if (chartByInsecticide) {
            const yearsRange = range(years[0], years[1] + 1);
            setLineChartDataByType(
                createLineChartData(
                    filteredStudiesWithoutNAInsecticideClassStudies,
                    selectedCountries,
                    yearsRange,
                    multipleSelectedInsecticides,
                    disaggregateBySpeciesSelection,
                    "by-insecticide"
                ) as SpreadOfResistanceOverTimeChartDataByType
            );

            setBarChartDataByType(
                createBarChartData(
                    filteredStudiesWithoutNAInsecticideClassStudies,
                    selectedCountries,
                    yearsRange,
                    singleSelectedInsecticide,
                    disaggregateBySpeciesSelection,
                    "by-insecticide"
                ) as SpreadOfResistanceOverTimeChartDataByType
            );
        }
    }, [
        disaggregateBySpeciesSelection,
        filteredStudiesWithoutNAInsecticideClassStudies,
        multipleSelectedInsecticides,
        selectedCountries,
        singleSelectedInsecticide,
        years,
        chartByInsecticide,
    ]);

    React.useEffect(() => {
        if (chartByInsecticide) {
            setCategoriesCountByInsecticide(
                countBy(filteredStudiesWithoutNAInsecticideClassStudies, "INSECTICIDE_TYPE")
            );
        } else {
            setCategoriesCountByInsecticide(undefined);
        }
    }, [filteredStudiesWithoutNAInsecticideClassStudies, chartByInsecticide]);

    const onChartByInsecticideChange = React.useCallback((type: "by-insecticide" | undefined) => {
        setChartByInsecticide(type);
    }, []);

    return {
        allInsecticides,
        multipleSelectedInsecticides,
        singleSelectedInsecticide,
        setMultipleSelectedInsecticides,
        setSingleSelectedInsecticide,
        categoriesCountByInsecticide,
        chartByInsecticide,
        lineChartDataByType,
        barChartDataByType,
        onChartByInsecticideChange,
        filtersByInsecticide: {
            ...filters,
            onInsecticideClassesChange: onInsecticideClassChange,
            onTypeChange: undefined,
            onInsecticideTypesChange: undefined,
            onSpeciesChange:
                filters.disaggregateBySpeciesSelection === "aggregate_species" ? undefined : filters.onSpeciesChange,
        } as PreventionFiltersState,
    };
}
