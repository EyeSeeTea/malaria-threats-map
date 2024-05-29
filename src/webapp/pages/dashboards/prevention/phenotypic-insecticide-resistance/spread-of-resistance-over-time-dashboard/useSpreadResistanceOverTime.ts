import i18next from "i18next";
import React from "react";

import { Option } from "../../../common/types";
import { usePrevention } from "../../usePrevention";
import { SpreadOfResistanceOverTimeChartType } from "../types";
import { useSpreadResistanceOverTimeByInsecticide } from "./useSpreadResistanceOverTimeByInsecticide";
import { useSpreadResistanceOverTimeByInsecticideClass } from "./useSpreadResistanceOverTimeByInsecticideClass";
import {
    filterByInsecticideResistanceStatusOptions,
    filterByResistanceStatus,
    filterByStudiesWithInsecticideClass,
} from "../../../../../components/layers/studies-filters";

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

const baseFilters = [
    filterByResistanceStatus,
    filterByStudiesWithInsecticideClass,
    filterByInsecticideResistanceStatusOptions,
];

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
    } = useSpreadResistanceOverTimeByInsecticide(singleSelectedInsecticideClass);

    const { speciesOptions } = usePrevention(baseFilters);

    const { disaggregateBySpeciesSelection, onSpeciesChange } = React.useMemo(() => {
        return chartByInsecticide ? filtersByInsecticide : filtersByClass;
    }, [chartByInsecticide, filtersByClass, filtersByInsecticide]);

    React.useEffect(() => {
        if (onSpeciesChange) {
            onSpeciesChange(speciesOptions.map(option => option.value));
        }
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
