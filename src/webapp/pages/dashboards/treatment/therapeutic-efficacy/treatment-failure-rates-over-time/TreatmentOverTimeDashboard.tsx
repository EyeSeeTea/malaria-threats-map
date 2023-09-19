import Highcharts from "highcharts";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
//import BubbleChartHelpImage from "../../../../assets/img/dashboards/bubble-chart-help.png";
import { TreatmentOverTimeType } from "../types";
import { ChartType, useTreatmentOverTime } from "./useTreatmentOverTime";
import More from "highcharts/highcharts-more";
import TreatmentFilterableDashboard from "../../TreatmentFilterableDashboard";
import { useCallback } from "react";
import TreatmentOverTimeGraph from "./graph/TreatmentOverTimeGraph";
import TreatmentOverTimeTable from "./table/TreatmentOverTimeTable";

More(Highcharts);

interface TreatmentOverTimeDashboardProps {
    id?: string;
    type: TreatmentOverTimeType;
}

const TreatmentOverTimeDashboard: React.FC<TreatmentOverTimeDashboardProps> = ({ id, type }) => {
    const { t } = useTranslation();
    const { chartTypes, chartType, filteredStudiesForDrugs, studiesCount, series, filters, onChartTypeChange } =
        useTreatmentOverTime(type);

    const chartComponentRef = useRef(null);

    const handleChartTypeChange = useCallback(
        (type: unknown) => {
            onChartTypeChange(type as ChartType);
        },
        [onChartTypeChange]
    );

    return (
        <TreatmentFilterableDashboard
            id={id}
            chartTypes={type === "treatmentFailure" ? chartTypes : []}
            chartType={type === "treatmentFailure" ? chartType : undefined}
            chartComponentRef={chartComponentRef}
            title={
                type === "treatmentFailure"
                    ? t("common.dashboard.therapeuticEfficacyDashboards.treatmentFailureOverTime.title")
                    : t("common.dashboard.therapeuticEfficacyDashboards.parasiteClearanceOverTime.title")
            }
            type={type}
            drugsMultiple={false}
            drugsClearable={false}
            filteredStudiesForDrugs={filteredStudiesForDrugs}
            studiesCount={studiesCount}
            plasmodiumSpecieDisabled={type === "positiveDay3"}
            filters={filters}
            onChartTypeChange={handleChartTypeChange}
        >
            {type === "treatmentFailure" && chartType === "table" ? (
                <TreatmentOverTimeTable studies={filteredStudiesForDrugs} />
            ) : (
                <TreatmentOverTimeGraph type={type} series={series} ref={chartComponentRef} />
            )}
        </TreatmentFilterableDashboard>
    );
};

export default React.memo(TreatmentOverTimeDashboard);
