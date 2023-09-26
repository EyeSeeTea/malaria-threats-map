import React, { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import PreventionFilterableDashboard from "../../PreventionFilterableDashboard";

import StatusOfResistanceToInsecticidePopup from "../../../../../components/dashboards/prevention/StatusOfResistanceToInsecticidePopup";
import { useInfoPopup } from "../../../common/popup/useInfoPopup";
import { useInsecticideResistanceAndResistanceMechanisms } from "./useInsecticideResistanceAndResistanceMechanisms";
import { ChartType } from "./InsecticideResistanceAndResistanceState";
import InsecticideResistanceAndResistanceMechanismsTable from "./table/InsecticideResistanceAndResistanceMechanismsTable";

const InsecticideResistanceAndResistanceMechanismsDashboard: React.FC = () => {
    const { t } = useTranslation();

    const { insecticideTypeOptions, chartType, chartTypes, filters, onChartTypeChange } =
        useInsecticideResistanceAndResistanceMechanisms();

    const { openPopup, onChangeOpenPopup } = useInfoPopup();

    const chartComponentRefs = useRef([]);

    const handleChartTypeChange = useCallback(
        (type: unknown) => {
            onChartTypeChange(type as ChartType);
        },
        [onChartTypeChange]
    );

    return (
        <React.Fragment>
            <PreventionFilterableDashboard
                id="status-resistance-insecticide"
                insecticideTypeOptions={insecticideTypeOptions}
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
            >
                {chartType === "graph" ? <div>Graph</div> : <InsecticideResistanceAndResistanceMechanismsTable />}
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
