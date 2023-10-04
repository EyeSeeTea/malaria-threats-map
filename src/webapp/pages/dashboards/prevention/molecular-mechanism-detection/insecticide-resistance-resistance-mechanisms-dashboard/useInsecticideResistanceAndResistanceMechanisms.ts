import i18next from "i18next";
import React from "react";
import { PreventionStudy } from "../../../../../../domain/entities/PreventionStudy";
import { Option } from "../../../common/types";
import { PreventionFiltersState } from "../../filters/PreventionFiltersState";
import { usePrevention } from "../../usePrevention";
import { createGraphData } from "./graph/createGraphData";
import { ChartType, InsecticideResistanceAndResistanceData } from "./InsecticideResistanceAndResistanceState";
import { createTableData } from "./table/createTableData";

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

const baseFilters: ((study: any) => boolean)[] = [];

export function useInsecticideResistanceAndResistanceMechanisms() {
    const { filteredStudies, filters, speciesOptions } = usePrevention(baseFilters);

    const [data, setData] = React.useState<InsecticideResistanceAndResistanceData>({ kind: "GraphData", series: [] });
    const [chartType, setChartType] = React.useState<ChartType>("graph");
    const { onSpeciesChange } = filters;

    React.useEffect(() => {
        const species = speciesOptions.map(s => s.value);
        onSpeciesChange(species);
    }, [onSpeciesChange, speciesOptions]);

    React.useEffect(() => {
        setData(createChartData(filteredStudies, chartType));
    }, [filteredStudies, chartType]);

    const onChartTypeChange = React.useCallback((type: ChartType) => {
        setChartType(type);
    }, []);

    return {
        filteredStudies,
        chartTypes,
        chartType,
        data,
        speciesOptions: chartType === "graph" ? speciesOptions : undefined,
        filters: {
            ...filters,
            onTypeChange: undefined,
            onInsecticideClassChange: undefined,
            onInsecticideTypesChange: undefined,
        } as PreventionFiltersState,
        onChartTypeChange,
    };
}

export function createChartData(
    filteredsStudies: PreventionStudy[],
    type: ChartType
): InsecticideResistanceAndResistanceData {
    if (type === "graph") {
        return { kind: "GraphData", series: createGraphData(filteredsStudies) };
    } else {
        return { kind: "TableData", rows: createTableData(filteredsStudies) };
    }
}
