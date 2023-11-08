import i18next from "i18next";
import { range, countBy, uniq } from "lodash";
import React from "react";

import { Option } from "../../../common/types";
import { usePrevention } from "../../usePrevention";
import { PreventionFiltersState } from "../../filters/PreventionFiltersState";
import {
    SpreadOfResistanceOverTimeChartDataByClass,
    SpreadOfResistanceOverTimeChartDataByType,
    SpreadOfResistanceOverTimeChartType,
} from "../types";
import { createBarChartData } from "./bar-chart/createBarChartData";
import { createLineChartData } from "./line-chart/createLineChartData";
import { sortInsecticideClasses } from "../../../../../components/filters/InsecticideClassFilter";

const chartTypes: Option<SpreadOfResistanceOverTimeChartType>[] = [
    {
        label: i18next.t("common.dashboard.phenotypicInsecticideResistanceDashboards.byInsecticideClass"),
        value: "by-insecticide-class",
    },
    {
        label: i18next.t("common.dashboard.phenotypicInsecticideResistanceDashboards.byInsecticide"),
        value: "by-insecticide",
    },
];

const baseFilters: ((study: any) => boolean)[] = [];

export function useSpreadResistanceOverTime() {
    const { preventionStudies, filteredStudies, selectedCountries, filters, speciesOptions } =
        usePrevention(baseFilters);

    const {
        disableSpeciesFilter,
        disaggregateBySpeciesSelection,
        years,
        onDisableSpeciesFilter,
        onDisaggregateBySpeciesChange,
        onSpeciesChange,
        onInsecticideClassChange,
    } = filters;

    const [lineChartDataByClass, setLineChartDataByClass] = React.useState<SpreadOfResistanceOverTimeChartDataByClass>({
        kind: "InsecticideByClass",
        data: { years: [], dataByCountry: {}, maxValue: 0 },
    });

    const [lineChartDataByType, setLineChartDataByType] = React.useState<SpreadOfResistanceOverTimeChartDataByType>({
        kind: "InsecticideByType",
        data: { years: [], dataByCountry: {}, maxValue: 0 },
    });

    const [barChartDataByClass, setBarChartDataByClass] = React.useState<SpreadOfResistanceOverTimeChartDataByClass>({
        kind: "InsecticideByClass",
        data: { years: [], dataByCountry: {}, maxValue: 0 },
    });

    const [barChartDataByType, setBarChartDataByType] = React.useState<SpreadOfResistanceOverTimeChartDataByType>({
        kind: "InsecticideByType",
        data: { years: [], dataByCountry: {}, maxValue: 0 },
    });

    const [categoriesCount, setCategoriesCount] = React.useState<Record<string, number>>({});
    const [chartType, setChartType] = React.useState<SpreadOfResistanceOverTimeChartType>("by-insecticide-class");
    const [allInsecticideClasses, setAllInsecticideClasses] = React.useState<string[]>([]);
    const [multipleSelectedInsecticideClasses, setMultipleSelectedInsecticideClasses] = React.useState<string[]>([]);
    const [singleSelectedInsecticideClass, setSingleSelectedInsecticideClass] = React.useState<string | undefined>(
        undefined
    );
    const [allInsecticides, setAllInsecticides] = React.useState<string[]>([]);
    const [multipleSelectedInsecticides, setMultipleSelectedInsecticides] = React.useState<string[]>([]);
    const [singleSelectedInsecticide, setSingleSelectedInsecticide] = React.useState<string | undefined>(undefined);

    const filteredStudiesWithoutNAInsecticideClassStudies = React.useMemo(
        () => filteredStudies.filter(study => study.INSECTICIDE_CLASS !== "NA"),
        [filteredStudies]
    );

    React.useEffect(() => {
        const hasToBeDisabledSpeciesFilter =
            onDisaggregateBySpeciesChange && disaggregateBySpeciesSelection === "aggregate_species";

        if (!disableSpeciesFilter && hasToBeDisabledSpeciesFilter) {
            onDisableSpeciesFilter(hasToBeDisabledSpeciesFilter);
        }

        if (disableSpeciesFilter && !hasToBeDisabledSpeciesFilter) {
            onDisableSpeciesFilter(false);
        }
    }, [disableSpeciesFilter, disaggregateBySpeciesSelection, onDisableSpeciesFilter, onDisaggregateBySpeciesChange]);

    React.useEffect(() => {
        onSpeciesChange(speciesOptions.map(option => option.value));
    }, [onSpeciesChange, speciesOptions]);

    React.useEffect(() => {
        onInsecticideClassChange(chartType === "by-insecticide-class" ? [] : ["PYRETHROIDS"]);
    }, [chartType, onInsecticideClassChange]);

    React.useEffect(() => {
        if (chartType === "by-insecticide-class") {
            const insecticideClasses = sortInsecticideClasses(
                uniq(
                    preventionStudies
                        .filter(study => study.INSECTICIDE_CLASS !== "NA")
                        .map(study => study.INSECTICIDE_CLASS)
                )
            );
            setAllInsecticideClasses(insecticideClasses);
            setMultipleSelectedInsecticideClasses(insecticideClasses);
            setSingleSelectedInsecticideClass(insecticideClasses[0]);
        }

        if (chartType === "by-insecticide") {
            const insecticides = uniq(
                preventionStudies.filter(study => study.INSECTICIDE_CLASS !== "NA").map(study => study.INSECTICIDE_TYPE)
            ).sort();
            setAllInsecticides(insecticides);
            setMultipleSelectedInsecticides(insecticides);
            setSingleSelectedInsecticide(insecticides[0]);
        }
    }, [chartType, preventionStudies]);

    React.useEffect(() => {
        if (chartType === "by-insecticide-class") {
            const yearsRange = range(years[0], years[1] + 1);
            setLineChartDataByClass(
                createLineChartData(
                    filteredStudiesWithoutNAInsecticideClassStudies,
                    selectedCountries,
                    yearsRange,
                    multipleSelectedInsecticideClasses,
                    disaggregateBySpeciesSelection,
                    "by-insecticide-class"
                ) as SpreadOfResistanceOverTimeChartDataByClass
            );

            setBarChartDataByClass(
                createBarChartData(
                    filteredStudiesWithoutNAInsecticideClassStudies,
                    selectedCountries,
                    yearsRange,
                    singleSelectedInsecticideClass,
                    disaggregateBySpeciesSelection,
                    "by-insecticide-class"
                ) as SpreadOfResistanceOverTimeChartDataByClass
            );
        }
    }, [
        chartType,
        disaggregateBySpeciesSelection,
        filteredStudiesWithoutNAInsecticideClassStudies,
        multipleSelectedInsecticideClasses,
        selectedCountries,
        singleSelectedInsecticideClass,
        years,
    ]);

    React.useEffect(() => {
        if (chartType === "by-insecticide") {
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
        chartType,
        disaggregateBySpeciesSelection,
        filteredStudiesWithoutNAInsecticideClassStudies,
        multipleSelectedInsecticides,
        selectedCountries,
        singleSelectedInsecticide,
        years,
    ]);

    React.useEffect(() => {
        if (chartType === "by-insecticide-class") {
            setCategoriesCount(countBy(filteredStudiesWithoutNAInsecticideClassStudies, "INSECTICIDE_CLASS"));
        } else {
            setCategoriesCount(countBy(filteredStudiesWithoutNAInsecticideClassStudies, "INSECTICIDE_TYPE"));
        }
    }, [chartType, filteredStudiesWithoutNAInsecticideClassStudies]);

    const onChartTypeChange = React.useCallback((type: SpreadOfResistanceOverTimeChartType) => {
        setChartType(type);
    }, []);

    const isDisaggregatedBySpecies = React.useMemo(() => {
        return disaggregateBySpeciesSelection === "disaggregate_species";
    }, [disaggregateBySpeciesSelection]);

    return {
        allInsecticideClasses,
        multipleSelectedInsecticideClasses,
        singleSelectedInsecticideClass,
        setMultipleSelectedInsecticideClasses,
        setSingleSelectedInsecticideClass,
        allInsecticides,
        multipleSelectedInsecticides,
        singleSelectedInsecticide,
        setMultipleSelectedInsecticides,
        setSingleSelectedInsecticide,
        categoriesCount,
        chartTypes,
        chartType,
        lineChartDataByClass,
        lineChartDataByType,
        barChartDataByClass,
        barChartDataByType,
        filters: {
            ...filters,
            onInsecticideClassesChange: chartType === "by-insecticide" ? onInsecticideClassChange : undefined,
            onTypeChange: undefined,
            onInsecticideTypesChange: undefined,
        } as PreventionFiltersState,
        speciesOptions,
        isDisaggregatedBySpecies,
        onChartTypeChange,
    };
}
