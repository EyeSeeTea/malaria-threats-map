import i18next from "i18next";
import _ from "lodash";
import React from "react";
import { PreventionStudy } from "../../../../../../domain/entities/PreventionStudy";
import { Option } from "../../../common/types";
import { PreventionFiltersState } from "../../filters/PreventionFiltersState";
import { ResistanceToInsecticideChartType } from "../../types";
import { usePrevention } from "../../usePrevention";
import { ResistanceToInsecticideSeriesGroup } from "../types";
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
        onInsecticideClassChange,
        onSpeciesChange,
        onInsecticideTypesChange,
        onYearsChange,
        onOnlyIncludeBioassaysWithMoreMosquitoesChange,
        onOnlyIncludeDataByHealthChange,
    } = usePrevention();

    const [data, setData] = React.useState<ResistanceToInsecticideSeriesGroup>({});
    const [categoriesCount, setCategoriesCount] = React.useState<Record<string, number>>({});
    const [chartType, setChartType] = React.useState<ResistanceToInsecticideChartType>("by-insecticide-class");

    React.useEffect(() => {
        setData(createChartData(preventionStudies, filteredStudies, selectedCountries, filters, chartType));
    }, [preventionStudies, filteredStudies, selectedCountries, filters, chartType]);

    React.useEffect(() => {
        if (chartType === "by-insecticide-class") {
            onInsecticideClassChange(insecticideClassOptions.map(op => op.value));
            onInsecticideTypesChange([]);
        } else {
            onInsecticideClassChange([]);
            onInsecticideTypesChange(insecticideTypeOptions.map(op => op.value));
        }
    }, [
        chartType,
        onInsecticideClassChange,
        onInsecticideTypesChange,
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
        filters,
        onChartTypeChange,
        onInsecticideClassChange,
        onSpeciesChange,
        onInsecticideTypesChange,
        onYearsChange,
        onOnlyIncludeBioassaysWithMoreMosquitoesChange,
        onOnlyIncludeDataByHealthChange,
    };
}

export function createChartData(
    allStudies: PreventionStudy[],
    filteredsStudies: PreventionStudy[],
    selectedCountries: string[],
    filters: PreventionFiltersState,
    type: ResistanceToInsecticideChartType
): ResistanceToInsecticideSeriesGroup {
    if (type === "by-insecticide") {
        return createChartDataByInsecticideType(allStudies, filteredsStudies, selectedCountries, filters);
    } else {
        return createChartDataByInsecticideClass(allStudies, filteredsStudies, selectedCountries, filters);
    }
}
