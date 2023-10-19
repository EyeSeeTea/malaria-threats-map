import i18next from "i18next";
import { range, countBy, uniq } from "lodash";
import React from "react";
import { Option } from "../../../common/types";
import { usePrevention } from "../../usePrevention";
import { PreventionFiltersState } from "../../filters/PreventionFiltersState";
import { SpreadOfResistanceOverTimeChartDataByClass, SpreadOfResistanceOverTimeChartType } from "../types";
import { createLineChartData as createLineChartDataByInsecticideClass } from "./by-insecticide-class/createLineChartData";
import { createBarChartData as createBarChartDataByInsecticideClass } from "./by-insecticide-class/createBarChartData";

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

    const [lineChartData, setLineChartData] = React.useState<SpreadOfResistanceOverTimeChartDataByClass>({
        kind: "InsecticideByClass",
        data: { years: [], dataByCountry: {}, maxValue: 0 },
    });
    const [barChartData, setBarChartData] = React.useState<SpreadOfResistanceOverTimeChartDataByClass>({
        kind: "InsecticideByClass",
        data: { years: [], dataByCountry: {}, maxValue: 0 },
    });
    const [categoriesCount, setCategoriesCount] = React.useState<Record<string, number>>({});
    const [chartType, setChartType] = React.useState<SpreadOfResistanceOverTimeChartType>("by-insecticide-class");
    const [allInsecticideClasses, setAllInsecticideClasses] = React.useState<string[]>([]);
    const [multipleSelectedInsecticideClasses, setMultipleSelectedInsecticideClasses] = React.useState<string[]>([]);
    const [singleSelectedInsecticideClass, setSingleSelectedInsecticideClass] = React.useState<string | undefined>(
        undefined
    );

    React.useEffect(() => {
        filters.onSpeciesChange(speciesOptions.map(option => option.value));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [speciesOptions]);

    React.useEffect(() => {
        filters.onInsecticideClassChange(allInsecticideClasses.map(option => option));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allInsecticideClasses]);

    React.useEffect(() => {
        const insecticideClasses = uniq(preventionStudies.map(study => study.INSECTICIDE_CLASS)).sort();
        setAllInsecticideClasses(insecticideClasses);
        setMultipleSelectedInsecticideClasses(insecticideClasses);
        setSingleSelectedInsecticideClass(insecticideClasses[0]);
    }, [preventionStudies]);

    React.useEffect(() => {
        const yearsRange = range(filters.years[0], filters.years[1] + 1);
        if (filteredStudies.length && multipleSelectedInsecticideClasses.length) {
            setLineChartData(
                createLineChartDataByInsecticideClass(
                    filteredStudies,
                    selectedCountries,
                    yearsRange,
                    multipleSelectedInsecticideClasses,
                    filters.disaggregateBySpeciesSelection
                )
            );
        }
        if (filteredStudies.length && singleSelectedInsecticideClass) {
            setBarChartData(
                createBarChartDataByInsecticideClass(
                    filteredStudies,
                    selectedCountries,
                    yearsRange,
                    singleSelectedInsecticideClass,
                    filters.disaggregateBySpeciesSelection
                )
            );
        }
    }, [
        filteredStudies,
        selectedCountries,
        filters.years,
        filters.disaggregateBySpeciesSelection,
        multipleSelectedInsecticideClasses,
        singleSelectedInsecticideClass,
    ]);

    React.useEffect(() => {
        if (chartType === "by-insecticide-class") {
            setCategoriesCount(countBy(filteredStudies, "INSECTICIDE_CLASS"));
        } else {
            setCategoriesCount(countBy(filteredStudies, "INSECTICIDE_TYPE"));
        }
    }, [chartType, filteredStudies]);

    const onChartTypeChange = React.useCallback((type: SpreadOfResistanceOverTimeChartType) => {
        setChartType(type);
    }, []);

    const isDisaggregatedBySpecies = React.useMemo(() => {
        return filters.disaggregateBySpeciesSelection === "disaggregate_species";
    }, [filters.disaggregateBySpeciesSelection]);

    return {
        allInsecticideClasses,
        multipleSelectedInsecticideClasses,
        singleSelectedInsecticideClass,
        setMultipleSelectedInsecticideClasses,
        setSingleSelectedInsecticideClass,
        filteredStudies,
        categoriesCount,
        chartTypes,
        chartType,
        lineChartData,
        barChartData,
        filters: {
            ...filters,
            onInsecticideClassesChange: undefined,
            onTypeChange: undefined,
            onInsecticideTypesChange: undefined,
        } as PreventionFiltersState,
        speciesOptions,
        isDisaggregatedBySpecies,
        onChartTypeChange,
    };
}
