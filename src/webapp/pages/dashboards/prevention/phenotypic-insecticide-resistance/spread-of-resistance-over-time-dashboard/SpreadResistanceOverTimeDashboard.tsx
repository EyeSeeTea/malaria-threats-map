import React, { useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Card } from "@mui/material";

import PreventionFilterableDashboard from "../../PreventionFilterableDashboard";
import { useSpreadResistanceOverTime } from "./useSpreadResistanceOverTime";
import { useInfoPopup } from "../../../common/popup/useInfoPopup";
import LineChart from "./line-chart/LineChart";
import SpreadOfResistanceOverTimePopup from "../../../../../components/dashboards/prevention/SpreadOfResistanceOverTimePopup";
import { ResistanceToInsecticideChartType } from "../../types";
import { SpreadOfResistanceOverTimeBarChart, SpreadOfResistanceOverTimeLineChart } from "../types";
import BarChart from "./bar-chart/BarChart";

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
                    <DasboardCard elevation={0}>
                        <LineChart
                            chartType="by-insecticide-class"
                            allInsecticideClassesOrTypes={allInsecticideClasses}
                            data={lineChartDataByClass.data as SpreadOfResistanceOverTimeLineChart}
                            chartComponentRefs={chartComponentRefs}
                            selectedInsecticideClassesOrTypes={multipleSelectedInsecticideClasses}
                            onInsecticideClassesOrTypesChange={setMultipleSelectedInsecticideClasses}
                            isDisaggregatedBySpecies={isDisaggregatedBySpecies}
                        />
                    </DasboardCard>
                )}
                {chartType === "by-insecticide-class" && (
                    <DasboardCard elevation={0}>
                        <BarChart
                            chartType="by-insecticide-class"
                            allInsecticideClassesOrTypes={allInsecticideClasses}
                            data={barChartDataByClass.data as SpreadOfResistanceOverTimeBarChart}
                            chartComponentRefs={chartComponentRefs}
                            selectedInsecticideClassesOrTypes={singleSelectedInsecticideClass}
                            onInsecticideClassesOrTypesChange={setSingleSelectedInsecticideClass}
                            isDisaggregatedBySpecies={isDisaggregatedBySpecies}
                        />
                    </DasboardCard>
                )}
                {chartType === "by-insecticide" && (
                    <DasboardCard elevation={0}>
                        <LineChart
                            chartType="by-insecticide"
                            allInsecticideClassesOrTypes={allInsecticides}
                            data={lineChartDataByType.data as SpreadOfResistanceOverTimeLineChart}
                            chartComponentRefs={chartComponentRefs}
                            selectedInsecticideClassesOrTypes={multipleSelectedInsecticides}
                            onInsecticideClassesOrTypesChange={setMultipleSelectedInsecticides}
                            isDisaggregatedBySpecies={isDisaggregatedBySpecies}
                        />
                    </DasboardCard>
                )}
                {chartType === "by-insecticide" && (
                    <DasboardCard elevation={0}>
                        <BarChart
                            chartType="by-insecticide"
                            allInsecticideClassesOrTypes={allInsecticides}
                            data={barChartDataByType.data as SpreadOfResistanceOverTimeBarChart}
                            chartComponentRefs={chartComponentRefs}
                            selectedInsecticideClassesOrTypes={singleSelectedInsecticide}
                            onInsecticideClassesOrTypesChange={setSingleSelectedInsecticide}
                            isDisaggregatedBySpecies={isDisaggregatedBySpecies}
                        />
                    </DasboardCard>
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

const DasboardCard = styled(Card)`
    min-height: 500px;
    padding: 42px;
`;
