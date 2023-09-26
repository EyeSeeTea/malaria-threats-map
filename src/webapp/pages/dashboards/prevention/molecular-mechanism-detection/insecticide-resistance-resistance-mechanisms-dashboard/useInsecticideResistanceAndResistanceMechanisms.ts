import i18next from "i18next";
import React from "react";
import { Option } from "../../../common/types";
import { PreventionFiltersState } from "../../filters/PreventionFiltersState";
import { usePrevention } from "../../usePrevention";
import { ChartType } from "./InsecticideResistanceAndResistanceState";

const chartTypes: Option<ChartType>[] = [
    {
        label: i18next.t(
            "common.dashboard.molecularMechanismDetectionDashboards.insecticideResistanceAndResistanceMechanisms.graph"
        ),
        value: "graph",
    },
    {
        label: i18next.t(
            "common.dashboard.molecularMechanismDetectionDashboards.insecticideResistanceAndResistanceMechanisms.table"
        ),
        value: "table",
    },
];

export function useInsecticideResistanceAndResistanceMechanisms() {
    const {
        preventionStudies,
        filteredStudies,
        insecticideClassOptions,
        insecticideTypeOptions,
        selectedCountries,
        filters,
    } = usePrevention();

    //const [data, setData] = React.useState<ResistanceToInsecticideChartData>({ kind: "InsecticideByClass", data: {} });
    const [chartType, setChartType] = React.useState<ChartType>("graph");

    // React.useEffect(() => {
    //     setData(createChartData(preventionStudies, filteredStudies, selectedCountries, filters, chartType));
    // }, [preventionStudies, filteredStudies, selectedCountries, filters, chartType]);

    const onChartTypeChange = React.useCallback((type: ChartType) => {
        setChartType(type);
    }, []);

    return {
        insecticideTypeOptions,
        filteredStudies,
        chartTypes,
        chartType,
        //data,
        filters: {
            ...filters,
            onTypeChange: undefined,
            onInsecticideClassChange: undefined,
            onInsecticideTypesChange: undefined,
        } as PreventionFiltersState,
        onChartTypeChange,
    };
}

// export function createChartData(
//     allStudies: PreventionStudy[],
//     filteredsStudies: PreventionStudy[],
//     selectedCountries: string[],
//     filters: PreventionFiltersState,
//     type: ResistanceToInsecticideChartType
// ): ResistanceToInsecticideChartData {
//     if (type === "by-insecticide") {
//         return createChartDataByInsecticideType(allStudies, filteredsStudies, selectedCountries, filters);
//     } else {
//         return createChartDataByInsecticideClass(allStudies, filteredsStudies, selectedCountries, filters);
//     }
// }
