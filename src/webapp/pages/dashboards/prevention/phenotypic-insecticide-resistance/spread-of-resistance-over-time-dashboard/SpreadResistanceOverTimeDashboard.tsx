import React, { useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import PreventionFilterableDashboard from "../../PreventionFilterableDashboard";
import { useSpreadResistanceOverTime } from "./useSpreadResistanceOverTime";
import { useInfoPopup } from "../../../common/popup/useInfoPopup";
import LineChart from "./by-insecticide-class/LineChart";
import SpreadOfResistanceOverTimePopup from "../../../../../components/dashboards/prevention/SpreadOfResistanceOverTimePopup";
import { ResistanceToInsecticideChartType } from "../../types";

const SpreadResistanceOverTimeDashboard: React.FC = () => {
    const { t } = useTranslation();

    const {
        chartType,
        chartTypes,
        categoriesCount,
        data,
        filters,
        speciesOptions,
        isDisaggregatedBySpecies,
        onChartTypeChange,
        allInsecticideClasses,
    } = useSpreadResistanceOverTime();

    const { openPopup, onChangeOpenPopup } = useInfoPopup();

    const chartComponentRefs = useRef([]);

    const handleChartTypeChange = useCallback(
        (type: unknown) => {
            onChartTypeChange(type as ResistanceToInsecticideChartType);
        },
        [onChartTypeChange]
    );

    return (
        <React.Fragment>
            <PreventionFilterableDashboard
                id="spread-of-resistance-over-time"
                chart="spread-of-resistance-over-time"
                chartTypes={chartTypes}
                chartType={chartType}
                count={categoriesCount}
                chartComponentRef={chartComponentRefs}
                title={t("common.dashboard.phenotypicInsecticideResistanceDashboards.spreadOfResistanceOverTime.title")}
                filters={filters}
                speciesOptions={speciesOptions}
                onChartTypeChange={handleChartTypeChange}
                onInfoClick={onChangeOpenPopup}
            >
                <LineChart
                    allInsecticideClasses={allInsecticideClasses}
                    data={data.data}
                    chartComponentRefs={chartComponentRefs}
                    selectedInsecticideClasses={filters.insecticideClasses}
                    onInsecticideClassesChange={filters.onInsecticideClassChange}
                    isDisaggregatedBySpecies={isDisaggregatedBySpecies}
                />
            </PreventionFilterableDashboard>
            <SpreadOfResistanceOverTimePopup
                years={filters.years}
                openInfoModal={openPopup}
                handleCloseInfoModal={onChangeOpenPopup}
            />
        </React.Fragment>
    );
};

export default React.memo(SpreadResistanceOverTimeDashboard);
