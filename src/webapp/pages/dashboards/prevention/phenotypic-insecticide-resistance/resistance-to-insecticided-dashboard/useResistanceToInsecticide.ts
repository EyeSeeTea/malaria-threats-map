import i18next from "i18next";
import _ from "lodash";
import React from "react";
import { PreventionStudy } from "../../../../../../domain/entities/PreventionStudy";
import { filterByResistanceStatus } from "../../../../../components/layers/studies-filters";
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

const baseFilters = [filterByResistanceStatus];

export function useResistanceToInsecticide() {
    const {
        preventionStudies,
        filteredStudies,
        insecticideClassOptions,
        insecticideTypeOptions,
        selectedCountries,
        filters,
    } = usePrevention(baseFilters);

    const { onInsecticideClassChange, onInsecticideTypesChange, insecticideClasses, insecticideTypes } = filters;

    const [data, setData] = React.useState<ResistanceToInsecticideChartData>({ kind: "InsecticideByClass", data: {} });
    const [categoriesCount, setCategoriesCount] = React.useState<Record<string, number>>({});
    const [chartType, setChartType] = React.useState<ResistanceToInsecticideChartType>("by-insecticide-class");

    React.useEffect(() => {
        setData(
            createChartData(
                preventionStudies,
                filteredStudies,
                selectedCountries,
                insecticideTypes,
                insecticideClasses,
                chartType
            )
        );
    }, [preventionStudies, filteredStudies, selectedCountries, chartType, insecticideTypes, insecticideClasses]);

    React.useEffect(() => {
        onInsecticideClassChange(insecticideClassOptions.map(op => op.value));
        onInsecticideTypesChange([]);
    }, [insecticideClassOptions, onInsecticideClassChange, onInsecticideTypesChange]);

    const resetInsecticideClassAndTypesOptionsByType = React.useCallback(
        (type: ResistanceToInsecticideChartType) => {
            if (type === "by-insecticide-class") {
                if (insecticideClasses.length === 0) {
                    onInsecticideClassChange(insecticideClassOptions.map(op => op.value));
                    onInsecticideTypesChange([]);
                }
            } else {
                //onInsecticideClassChange([]);
                onInsecticideTypesChange(insecticideTypeOptions.map(op => op.value));
            }
        },
        [
            insecticideClassOptions,
            insecticideClasses.length,
            insecticideTypeOptions,
            onInsecticideClassChange,
            onInsecticideTypesChange,
        ]
    );

    React.useEffect(() => {
        if (chartType === "by-insecticide-class") {
            setCategoriesCount(_.countBy(filteredStudies, "INSECTICIDE_CLASS"));
        } else {
            setCategoriesCount(_.countBy(filteredStudies, "INSECTICIDE_TYPE"));
        }
    }, [chartType, filteredStudies]);

    const onChartTypeChange = React.useCallback(
        (type: ResistanceToInsecticideChartType) => {
            setChartType(type);
            resetInsecticideClassAndTypesOptionsByType(type);
        },
        [resetInsecticideClassAndTypesOptionsByType]
    );

    return {
        insecticideTypeOptions,
        filteredStudies,
        categoriesCount,
        chartTypes,
        chartType,
        data,
        filters: {
            ...filters,
            insecticideClasses,
            insecticideTypes,
            onInsecticideClassesChange: chartType === "by-insecticide-class" ? onInsecticideClassChange : undefined,
            onInsecticideTypesChange: chartType === "by-insecticide" ? onInsecticideTypesChange : undefined,
            onTypeChange: undefined,
            onDisaggregateBySpeciesChange: undefined,
        } as PreventionFiltersState,
        onChartTypeChange,
    };
}

export function createChartData(
    allStudies: PreventionStudy[],
    filteredsStudies: PreventionStudy[],
    selectedCountries: string[],
    insecticideTypes: string[],
    insecticideClasses: string[],
    type: ResistanceToInsecticideChartType
): ResistanceToInsecticideChartData {
    if (type === "by-insecticide") {
        return createChartDataByInsecticideType(allStudies, filteredsStudies, selectedCountries, insecticideTypes);
    } else {
        return createChartDataByInsecticideClass(allStudies, filteredsStudies, selectedCountries, insecticideClasses);
    }
}
