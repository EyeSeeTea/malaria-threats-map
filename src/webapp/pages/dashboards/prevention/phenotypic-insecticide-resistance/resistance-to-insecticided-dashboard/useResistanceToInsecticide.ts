import i18next from "i18next";
import _ from "lodash";
import React from "react";
import { PreventionStudy } from "../../../../../../domain/entities/PreventionStudy";
import { Option } from "../../../common/types";
import { PreventionFiltersState } from "../../filters/PreventionFiltersState";
import { ResistanceToInsecticideChartType } from "../../types";
import { usePrevention } from "../../usePrevention";
import { ResistanceToInsecticideChartData } from "../types";
import { createChartDataByInsecticideClass } from "./createChartDataByInsecticideClass";
import { createChartDataByInsecticideType } from "./createChartDataByInsecticideType";

const chartTypes: Option<ResistanceToInsecticideChartType>[] = [
    {
        label: i18next.t("common.dashboard.phenotypicInsecticideResistanceDashboards.byInsecticideClass"),
        value: "by-insecticide-class",
    },
    {
        label: i18next.t("common.dashboard.phenotypicInsecticideResistanceDashboards.byInsecticide"),
        value: "by-insecticide",
    },
];

export function useResistanceToInsecticide() {
    const {
        preventionStudies,
        filteredStudies,
        insecticideClassOptions,
        insecticideTypeOptions,
        selectedCountries,
        filters,
    } = usePrevention();

    const [data, setData] = React.useState<ResistanceToInsecticideChartData>({ kind: "InsecticideByClass", data: {} });
    const [categoriesCount, setCategoriesCount] = React.useState<Record<string, number>>({});
    const [chartType, setChartType] = React.useState<ResistanceToInsecticideChartType>("by-insecticide-class");

    React.useEffect(() => {
        setData(createChartData(preventionStudies, filteredStudies, selectedCountries, filters, chartType));
    }, [preventionStudies, filteredStudies, selectedCountries, filters, chartType]);

    React.useEffect(() => {
        if (chartType === "by-insecticide-class") {
            filters.onInsecticideClassChange(insecticideClassOptions.map(op => op.value));
            filters.onInsecticideTypesChange([]);
        } else {
            filters.onInsecticideClassChange([]);
            filters.onInsecticideTypesChange(insecticideTypeOptions.map(op => op.value));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        chartType,
        filters.onInsecticideClassChange,
        filters.onInsecticideTypesChange,
        insecticideClassOptions,
        insecticideTypeOptions,
    ]);

    React.useEffect(() => {
        if (chartType === "by-insecticide-class") {
            setCategoriesCount(_.countBy(filteredStudies, "INSECTICIDE_CLASS"));
        } else {
            setCategoriesCount(_.countBy(filteredStudies, "INSECTICIDE_TYPE"));
        }
    }, [chartType, filteredStudies]);

    const onChartTypeChange = React.useCallback((type: ResistanceToInsecticideChartType) => {
        setChartType(type);
    }, []);

    return {
        insecticideTypeOptions,
        filteredStudies,
        categoriesCount,
        chartTypes,
        chartType,
        data,
        filters: {
            ...filters,
            onInsecticideClassesChange:
                chartType === "by-insecticide-class" ? filters.onInsecticideClassChange : undefined,
            onInsecticideTypesChange: chartType === "by-insecticide" ? filters.onInsecticideTypesChange : undefined,
            onTypeChange: undefined,
        } as PreventionFiltersState,
        onChartTypeChange,
    };
}

export function createChartData(
    allStudies: PreventionStudy[],
    filteredsStudies: PreventionStudy[],
    selectedCountries: string[],
    filters: PreventionFiltersState,
    type: ResistanceToInsecticideChartType
): ResistanceToInsecticideChartData {
    if (type === "by-insecticide") {
        return createChartDataByInsecticideType(allStudies, filteredsStudies, selectedCountries, filters);
    } else {
        return createChartDataByInsecticideClass(allStudies, filteredsStudies, selectedCountries, filters);
    }
}
