import React, { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import PreventionFilterableDashboard from "../../PreventionFilterableDashboard";

import StatusOfResistanceToInsecticidePopup from "../../../../../components/dashboards/prevention/StatusOfResistanceToInsecticidePopup";
import { useInfoPopup } from "../../../common/popup/useInfoPopup";
import { useInsecticideResistanceAndResistanceMechanisms } from "./useInsecticideResistanceAndResistanceMechanisms";
import { ChartType } from "./InsecticideResistanceAndResistanceState";
import InsecticideResistanceAndResistanceMechanismsTable, {
    headCells,
} from "./table/InsecticideResistanceAndResistanceMechanismsTable";
import { exportToCSV } from "../../../../../components/DataDownload/download";
import { format } from "date-fns";
import { sendAnalytics } from "../../../../../utils/analytics";
import InsecticideResistanceAndResistanceMechanismsGraph from "./graph/InsecticideResistanceAndResistanceMechanismsGraph";
import i18next from "i18next";
import { capitalizeFirstLetter } from "../../../../../utils/string-utils";

const InsecticideResistanceAndResistanceMechanismsDashboard: React.FC = () => {
    const { t } = useTranslation();

    const { chartType, chartTypes, filters, data, onChartTypeChange, speciesOptions, count } =
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
            const studies = data.rows.map(row => {
                return Object.entries(row).reduce((acc, [field, value]) => {
                    const cell = headCells.find(cell => cell.id === field);

                    if (!cell) {
                        return acc;
                    } else {
                        const fieldParts = field.split("_");

                        const labelField =
                            fieldParts.length > 0
                                ? capitalizeFirstLetter(
                                      `${field.split("_")[0].toLowerCase()} - ${i18next.t(cell.label)}`
                                  )
                                : i18next.t(cell.label);

                        return {
                            ...acc,
                            [labelField]: value,
                        };
                    }
                }, {});
            });

            console.log(studies);

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
                id="insecticide-resistance-resistance-mechanisms"
                chart="insecticide-resistance-resistance-mechanisms"
                chartTypes={chartTypes}
                chartType={chartType}
                count={count}
                chartComponentRef={chartComponentRefs}
                title={t(
                    "common.dashboard.molecularMechanismDetectionDashboards.insecticideResistanceAndResistanceMechanisms.title"
                )}
                filters={filters}
                onChartTypeChange={handleChartTypeChange}
                onInfoClick={onChangeOpenPopup}
                onDownload={data.kind === "TableData" ? downloadTable : undefined}
                speciesOptions={speciesOptions}
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
