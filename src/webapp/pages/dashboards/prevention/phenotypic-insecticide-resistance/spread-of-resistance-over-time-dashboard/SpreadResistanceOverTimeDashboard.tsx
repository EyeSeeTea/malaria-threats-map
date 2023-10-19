import React, { useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import PreventionFilterableDashboard from "../../PreventionFilterableDashboard";
import { useSpreadResistanceOverTime } from "./useSpreadResistanceOverTime";
import { useInfoPopup } from "../../../common/popup/useInfoPopup";
import LineChart from "./by-insecticide-class/LineChart";
import SpreadOfResistanceOverTimePopup from "../../../../../components/dashboards/prevention/SpreadOfResistanceOverTimePopup";
import { ResistanceToInsecticideChartType } from "../../types";
import { SpreadOfResistanceOverTimeBarChart, SpreadOfResistanceOverTimeLineChart } from "../types";
import BarChart from "./by-insecticide-class/BarChart";
import styled from "styled-components";

const SpreadResistanceOverTimeDashboard: React.FC = () => {
    const { t } = useTranslation();

    const {
        chartType,
        chartTypes,
        categoriesCount,
        lineChartData,
        barChartData,
        filters,
        speciesOptions,
        isDisaggregatedBySpecies,
        onChartTypeChange,
        allInsecticideClasses,
        multipleSelectedInsecticideClasses,
        singleSelectedInsecticideClass,
        setMultipleSelectedInsecticideClasses,
        setSingleSelectedInsecticideClass,
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
                <ChartsContainer>
                    <LineChart
                        allInsecticideClasses={allInsecticideClasses}
                        data={lineChartData.data as SpreadOfResistanceOverTimeLineChart}
                        chartComponentRefs={chartComponentRefs}
                        selectedInsecticideClasses={multipleSelectedInsecticideClasses}
                        onInsecticideClassesChange={setMultipleSelectedInsecticideClasses}
                        isDisaggregatedBySpecies={isDisaggregatedBySpecies}
                    />
                    <BarChart
                        allInsecticideClasses={allInsecticideClasses}
                        data={barChartData.data as SpreadOfResistanceOverTimeBarChart}
                        chartComponentRefs={chartComponentRefs}
                        selectedInsecticideClass={singleSelectedInsecticideClass}
                        onInsecticideClassChange={setSingleSelectedInsecticideClass}
                        isDisaggregatedBySpecies={isDisaggregatedBySpecies}
                    />
                </ChartsContainer>
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

const ChartsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
`;
