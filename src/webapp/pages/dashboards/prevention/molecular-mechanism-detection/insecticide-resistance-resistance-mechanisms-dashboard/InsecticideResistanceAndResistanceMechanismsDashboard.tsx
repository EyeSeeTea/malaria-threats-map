import React, { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import PreventionFilterableDashboard from "../../PreventionFilterableDashboard";

import StatusOfResistanceToInsecticidePopup from "../../../../../components/dashboards/prevention/StatusOfResistanceToInsecticidePopup";
import { useInfoPopup } from "../../../common/popup/useInfoPopup";
import { useInsecticideResistanceAndResistanceMechanisms } from "./useInsecticideResistanceAndResistanceMechanisms";
import { ChartType } from "./InsecticideResistanceAndResistanceState";
import InsecticideResistanceAndResistanceMechanismsTable from "./table/InsecticideResistanceAndResistanceMechanismsTable";
import { exportToCSV } from "../../../../../components/DataDownload/download";
import { format } from "date-fns";
import { sendAnalytics } from "../../../../../utils/analytics";
import InsecticideResistanceAndResistanceMechanismsGraph from "./graph/InsecticideResistanceAndResistanceMechanismsGraph";

const InsecticideResistanceAndResistanceMechanismsDashboard: React.FC = () => {
    const { t } = useTranslation();

    const { chartType, chartTypes, filters, data, onChartTypeChange } =
        useInsecticideResistanceAndResistanceMechanisms();

    const { openPopup, onChangeOpenPopup } = useInfoPopup();

    const chartComponentRefs = useRef([]);

    const handleChartTypeChange = useCallback(
        (type: unknown) => {
            onChartTypeChange(type as ChartType);
        },
        [onChartTypeChange]
    );

    const downloadTable = () => {
        if (data.kind === "TableData") {
            const studies = data.rows.map(group =>
                Object.entries(group).reduce((acc, [field, value]) => {
                    if (field === "ID") {
                        return acc;
                    } else {
                        return {
                            ...acc,
                            [field]: (typeof value === "number" && isNaN(value)) || value === "-" ? "" : value,
                        };
                    }
                }, {})
            );

            const tabs = [
                {
                    name: "Data",
                    studies: studies,
                },
            ];

            const dateString = format(new Date(), "yyyyMMdd");
            exportToCSV(tabs, `MTM_PREVENTION_${dateString}`);
            sendAnalytics({
                type: "event",
                category: "tableView",
                action: "download",
                label: "prevention",
            });
        }
    };

    return (
        <React.Fragment>
            <PreventionFilterableDashboard
                id="status-resistance-insecticide"
                chart="status-of-resistance-of-insecticide"
                chartTypes={chartTypes}
                chartType={chartType}
                count={0}
                chartComponentRef={chartComponentRefs}
                title={t(
                    "common.dashboard.phenotypicInsecticideResistanceDashboards.statusOfResistanceToInsecticides.title"
                )}
                filters={filters}
                onChartTypeChange={handleChartTypeChange}
                onInfoClick={onChangeOpenPopup}
                onDownload={data.kind === "TableData" ? downloadTable : undefined}
            >
                {data.kind === "GraphData" ? (
                    <InsecticideResistanceAndResistanceMechanismsGraph series={data.series} />
                ) : (
                    <InsecticideResistanceAndResistanceMechanismsTable rows={data.rows} />
                )}
            </PreventionFilterableDashboard>
            <StatusOfResistanceToInsecticidePopup
                years={filters.years}
                openInfoModal={openPopup}
                handleCloseInfoModal={onChangeOpenPopup}
            />
        </React.Fragment>
    );
};

export default React.memo(InsecticideResistanceAndResistanceMechanismsDashboard);
