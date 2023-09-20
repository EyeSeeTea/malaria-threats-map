import Highcharts from "highcharts";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useTreatmentOverTime } from "./useTreatmentOverTime";
import More from "highcharts/highcharts-more";
import TreatmentFilterableDashboard from "../../TreatmentFilterableDashboard";
import { useCallback } from "react";
import TreatmentOverTimeGraph from "./graph/TreatmentOverTimeGraph";
import TreatmentOverTimeTable from "./table/TreatmentOverTimeTable";
import { ChartType, TreatmentOverTimeType } from "./TreatmentOverTimeState";
import format from "date-fns/format";
import { exportToCSV } from "../../../../../components/DataDownload/download";
import { sendAnalytics } from "../../../../../utils/analytics";

More(Highcharts);

interface TreatmentOverTimeDashboardProps {
    id?: string;
    type: TreatmentOverTimeType;
}

const TreatmentOverTimeDashboard: React.FC<TreatmentOverTimeDashboardProps> = ({ id, type }) => {
    const { t } = useTranslation();
    const { chartTypes, chartType, filteredStudiesForDrugs, studiesCount, data, filters, onChartTypeChange } =
        useTreatmentOverTime(type);

    const chartComponentRef = useRef(null);

    const handleChartTypeChange = useCallback(
        (type: unknown) => {
            onChartTypeChange(type as ChartType);
        },
        [onChartTypeChange]
    );

    const downloadTable = () => {
        if (data.kind === "TableData") {
            const studies = data.rows.map(row => {
                const study = { ...row };
                delete study.ID;
                delete study.COUNTRY_NUMBER;
                return study;
            });
            const tabs = [
                {
                    name: "Data",
                    studies: studies,
                },
            ];
            const dateString = format(new Date(), "yyyyMMdd");
            exportToCSV(tabs, `MTM_TREATMENT_${dateString}`);
            sendAnalytics({
                type: "event",
                category: "tableView",
                action: "download",
                label: "treatment",
            });
        }
    };

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
            onDownload={data.kind === "TableData" ? downloadTable : undefined}
        >
            {data.kind === "TableData" ? (
                <TreatmentOverTimeTable rows={data.rows} plasmodiumSpecie={data.plasmodiumSpecies} />
            ) : (
                <TreatmentOverTimeGraph type={type} series={data.series} ref={chartComponentRef} />
            )}
        </TreatmentFilterableDashboard>
    );
};

export default React.memo(TreatmentOverTimeDashboard);
