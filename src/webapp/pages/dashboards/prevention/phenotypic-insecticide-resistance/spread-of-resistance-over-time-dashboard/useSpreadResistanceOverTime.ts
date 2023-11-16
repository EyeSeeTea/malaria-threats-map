import i18next from "i18next";
import React from "react";

import { Option } from "../../../common/types";
import { usePrevention } from "../../usePrevention";
import { SpreadOfResistanceOverTimeChartType } from "../types";
import { useSpreadResistanceOverTimeByInsecticide } from "./useSpreadResistanceOverTimeByInsecticide";
import { useSpreadResistanceOverTimeByInsecticideClass } from "./useSpreadResistanceOverTimeByInsecticideClass";

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
    const {
        allInsecticideClasses,
        multipleSelectedInsecticideClasses,
        singleSelectedInsecticideClass,
        setMultipleSelectedInsecticideClasses,
        setSingleSelectedInsecticideClass,
        categoriesCountByInsecticideClass,
        chartByClass,
        lineChartDataByClass,
        barChartDataByClass,
        onChartByClassChange,
        filtersByClass,
    } = useSpreadResistanceOverTimeByInsecticideClass();

    const {
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
        filtersByInsecticide,
    } = useSpreadResistanceOverTimeByInsecticide();

    const { speciesOptions } = usePrevention(baseFilters);

    const {
        disableSpeciesFilter,
        disaggregateBySpeciesSelection,
        onDisableSpeciesFilter,
        onDisaggregateBySpeciesChange,
        onSpeciesChange,
    } = React.useMemo(() => {
        return chartByInsecticide ? filtersByInsecticide : filtersByClass;
    }, [chartByInsecticide, filtersByClass, filtersByInsecticide]);

    React.useEffect(() => {
        const hasToBeDisabledSpeciesFilter =
            onDisaggregateBySpeciesChange && disaggregateBySpeciesSelection === "aggregate_species";

        if (!disableSpeciesFilter && hasToBeDisabledSpeciesFilter) {
            onDisableSpeciesFilter(hasToBeDisabledSpeciesFilter);
            onSpeciesChange(speciesOptions.map(option => option.value));
        }

        if (disableSpeciesFilter && !hasToBeDisabledSpeciesFilter) {
            onDisableSpeciesFilter(false);
        }
    }, [
        disableSpeciesFilter,
        disaggregateBySpeciesSelection,
        onDisableSpeciesFilter,
        onDisaggregateBySpeciesChange,
        onSpeciesChange,
        speciesOptions,
    ]);

    React.useEffect(() => {
        onSpeciesChange(speciesOptions.map(option => option.value));
    }, [onSpeciesChange, speciesOptions]);

    const onChartTypeChange = React.useCallback(
        (type: SpreadOfResistanceOverTimeChartType) => {
            onChartByClassChange(type === "by-insecticide-class" ? type : undefined);
            onChartByInsecticideChange(type === "by-insecticide" ? type : undefined);
        },
        [onChartByClassChange, onChartByInsecticideChange]
    );

    const isDisaggregatedBySpecies = React.useMemo(() => {
        return disaggregateBySpeciesSelection === "disaggregate_species";
    }, [disaggregateBySpeciesSelection]);

    return {
        chartTypes,
        categoriesCount: categoriesCountByInsecticide || categoriesCountByInsecticideClass,
        chartType: chartByInsecticide || chartByClass,
        lineChartDataByClass,
        lineChartDataByType,
        barChartDataByClass,
        barChartDataByType,
        filters: chartByInsecticide ? filtersByInsecticide : filtersByClass,
        speciesOptions,
        isDisaggregatedBySpecies,
        onChartTypeChange,
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
    };
}
