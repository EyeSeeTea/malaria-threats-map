import i18next from "i18next";
import React from "react";
import { PreventionStudy } from "../../../../../../domain/entities/PreventionStudy";
import { Option } from "../../../common/types";
import { PreventionFiltersState } from "../../filters/PreventionFiltersState";
import { usePrevention } from "../../usePrevention";
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

export function useInsecticideResistanceAndResistanceMechanisms() {
    const { filteredStudies, filters } = usePrevention();

    const [data, setData] = React.useState<InsecticideResistanceAndResistanceData>({ kind: "GraphData", series: [] });
    const [chartType, setChartType] = React.useState<ChartType>("graph");

    React.useEffect(() => {
        setData(createChartData(filteredStudies, chartType));
        console.log("setData");
    }, [filteredStudies, chartType]);

    const onChartTypeChange = React.useCallback((type: ChartType) => {
        setChartType(type);
    }, []);

    return {
        filteredStudies,
        chartTypes,
        chartType,
        data,
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
        return { kind: "GraphData", series: [] as PreventionStudy[] };
    } else {
        return { kind: "TableData", rows: createTableData(filteredsStudies) };
    }
}
