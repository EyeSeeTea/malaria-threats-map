import i18next from "i18next";
import React, { useCallback } from "react";
import { useTreatment } from "../../useTreatment";
import { Option } from "../../../common/types";
import {
    ChartType,
    TreatmentOverTimeData,
    TreatmentOverTimeState,
    TreatmentOverTimeType,
} from "./TreatmentOverTimeState";

import { createTreatmentBubbleChartData } from "./graph/createTreatmentBubbleChartData";
import { createTreatmentTableData } from "./table/createTreatmentTableData";
import { TreatmentFiltersState } from "../../filters/TreatmentFiltersState";

const chartTypes: Option<ChartType>[] = [
    {
        label: i18next.t("common.dashboard.therapeuticEfficacyDashboards.treatmentFailureOverTime.graph"),
        value: "graph",
    },
    {
        label: i18next.t("common.dashboard.therapeuticEfficacyDashboards.treatmentFailureOverTime.table"),
        value: "table",
    },
];

export function useTreatmentOverTime(treatmentType: TreatmentOverTimeType): TreatmentOverTimeState {
    const { filteredStudies, filteredStudiesForDrugs, studiesCount, filters } = useTreatment(false);

    const [data, setData] = React.useState<TreatmentOverTimeData>({ kind: "GraphData", series: [] });
    const [chartType, setChartType] = React.useState<ChartType>(chartTypes[0].value);

    React.useEffect(() => {
        if (chartType === "graph") {
            setData(createTreatmentBubbleChartData(filteredStudies, treatmentType, filters.years));
        } else {
            setData(createTreatmentTableData(filteredStudies, filters.plasmodiumSpecies));
        }
    }, [filteredStudies, treatmentType, filters.years, chartType, filters.plasmodiumSpecies]);

    const onChartTypeChange = useCallback(
        (type: ChartType) => {
            if (type === "graph") {
                const firstDrug = filters.drugs[0];

                if (firstDrug) filters.onDrugsChange([firstDrug]);
            }

            setChartType(type);
        },
        [filters]
    );

    return {
        chartTypes,
        chartType,
        studiesCount,
        filteredStudiesForDrugs,
        data,
        filters:
            chartType === "table"
                ? filters
                : ({ ...filters, onChangeShowDataForAllCountries: undefined } as TreatmentFiltersState),
        onChartTypeChange,
    };
}
