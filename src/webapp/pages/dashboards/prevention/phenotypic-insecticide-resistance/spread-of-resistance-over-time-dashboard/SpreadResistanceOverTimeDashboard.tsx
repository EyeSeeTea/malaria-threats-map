import React, { useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";

import PreventionFilterableDashboard from "../../PreventionFilterableDashboard";
import { useSpreadResistanceOverTime } from "./useSpreadResistanceOverTime";
import { useInfoPopup } from "../../../common/popup/useInfoPopup";
import LineChart from "./LineChart";
import SpreadOfResistanceOverTimePopup from "../../../../../components/dashboards/prevention/SpreadOfResistanceOverTimePopup";
import { ResistanceToInsecticideChartType } from "../../types";
import { SpreadOfResistanceOverTimeBarChart, SpreadOfResistanceOverTimeLineChart } from "../types";
import BarChart from "./BarChart";

const SpreadResistanceOverTimeDashboard: React.FC = () => {
    const { t } = useTranslation();

    const {
        chartType,
        chartTypes,
        categoriesCount,
        lineChartDataByClass,
        lineChartDataByType,
        barChartDataByClass,
        barChartDataByType,
        filters,
        speciesOptions,
        isDisaggregatedBySpecies,
        onChartTypeChange,
        allInsecticideClasses,
        multipleSelectedInsecticideClasses,
        singleSelectedInsecticideClass,
        setMultipleSelectedInsecticideClasses,
        setSingleSelectedInsecticideClass,
        allInsecticides,
        multipleSelectedInsecticides,
        singleSelectedInsecticide,
        setMultipleSelectedInsecticides,
        setSingleSelectedInsecticide,
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
                {chartType === "by-insecticide-class" && (
                    <LineChart
                        chartType="by-insecticide-class"
                        allInsecticideClassesOrTypes={allInsecticideClasses}
                        data={lineChartDataByClass.data as SpreadOfResistanceOverTimeLineChart}
                        chartComponentRefs={chartComponentRefs}
                        selectedInsecticideClassesOrTypes={multipleSelectedInsecticideClasses}
                        onInsecticideClassesOrTypesChange={setMultipleSelectedInsecticideClasses}
                        isDisaggregatedBySpecies={isDisaggregatedBySpecies}
                    />
                )}
                {chartType === "by-insecticide-class" && (
                    <BarChart
                        chartType="by-insecticide-class"
                        allInsecticideClassesOrTypes={allInsecticideClasses}
                        data={barChartDataByClass.data as SpreadOfResistanceOverTimeBarChart}
                        chartComponentRefs={chartComponentRefs}
                        selectedInsecticideClassesOrTypes={singleSelectedInsecticideClass}
                        onInsecticideClassesOrTypesChange={setSingleSelectedInsecticideClass}
                        isDisaggregatedBySpecies={isDisaggregatedBySpecies}
                    />
                )}
                {chartType === "by-insecticide" && (
                    <LineChart
                        chartType="by-insecticide"
                        allInsecticideClassesOrTypes={allInsecticides}
                        data={lineChartDataByType.data as SpreadOfResistanceOverTimeLineChart}
                        chartComponentRefs={chartComponentRefs}
                        selectedInsecticideClassesOrTypes={multipleSelectedInsecticides}
                        onInsecticideClassesOrTypesChange={setMultipleSelectedInsecticides}
                        isDisaggregatedBySpecies={isDisaggregatedBySpecies}
                    />
                )}
                {chartType === "by-insecticide" && (
                    <BarChart
                        chartType="by-insecticide"
                        allInsecticideClassesOrTypes={allInsecticides}
                        data={barChartDataByType.data as SpreadOfResistanceOverTimeBarChart}
                        chartComponentRefs={chartComponentRefs}
                        selectedInsecticideClassesOrTypes={singleSelectedInsecticide}
                        onInsecticideClassesOrTypesChange={setSingleSelectedInsecticide}
                        isDisaggregatedBySpecies={isDisaggregatedBySpecies}
                    />
                )}
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
