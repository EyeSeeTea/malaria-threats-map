import React from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { getValueLabelFilters } from "./map-actions/utils";
import { State } from "../store/types";
import {
    selectFilters,
    selectLastUpdatedDates,
    selectMaxMinYears,
    selectRegion,
    selectTheme,
} from "../store/reducers/base-reducer";
import { selectDiagnosisFilters } from "../store/reducers/diagnosis-reducer";
import { selectPreventionFilters } from "../store/reducers/prevention-reducer";
import { selectInvasiveFilters } from "../store/reducers/invasive-reducer";
import { selectTreatmentFilters } from "../store/reducers/treatment-reducer";
import { selectTranslations } from "../store/reducers/translations-reducer";

const mapStateToProps = (state: State) => ({
    region: selectRegion(state),
    theme: selectTheme(state),
    preventionFilters: selectPreventionFilters(state),
    invasiveFilters: selectInvasiveFilters(state),
    diagnosisFilters: selectDiagnosisFilters(state),
    treatmentFilters: selectTreatmentFilters(state),
    maxMinYears: selectMaxMinYears(state),
    yearFilters: selectFilters(state),
    translations: selectTranslations(state),
    lastUpdatedDates: selectLastUpdatedDates(state),
});

type StateProps = ReturnType<typeof mapStateToProps>;
type MapInfoSummaryLegendProps = StateProps;

function MapInfoSummaryLegend({
    region,
    theme,
    preventionFilters,
    invasiveFilters,
    diagnosisFilters,
    treatmentFilters,
    maxMinYears,
    yearFilters,
    translations,
    lastUpdatedDates,
}: MapInfoSummaryLegendProps) {
    const { t } = useTranslation();

    const selectedValueLabelFilters = React.useMemo(() => {
        if (!translations?.length) return;

        return getValueLabelFilters(
            theme,
            preventionFilters,
            treatmentFilters,
            diagnosisFilters,
            invasiveFilters,
            maxMinYears,
            yearFilters
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        translations,
        theme,
        preventionFilters,
        treatmentFilters,
        diagnosisFilters,
        invasiveFilters,
        maxMinYears,
        yearFilters,
        t,
    ]);

    const themeSelector = theme as "prevention" | "diagnosis" | "treatment" | "invasive";

    return (
        <MapInfoSummaryLegendContainer>
            {region?.country && (
                <InfoRowContainer>
                    <Label>{t("common.map_info_summary.country")}:</Label>
                    <InfoValue>{t(`COUNTRY_NAME.${region.country}`)}</InfoValue>
                </InfoRowContainer>
            )}
            <DataFilterContainer>
                {Object.entries(selectedValueLabelFilters).map(([key, valueLabel]: string[]) => (
                    <DataFilterRowContainer key={`${key}_${valueLabel}`}>
                        <Label>{t(`common.map_info_summary.${key}`)}:</Label>
                        <DataFilterValue>{valueLabel}</DataFilterValue>
                    </DataFilterRowContainer>
                ))}
            </DataFilterContainer>
            {lastUpdatedDates[themeSelector] && (
                <InfoRowContainer>
                    <Label>{t("common.map_info_summary.last_updated")}:</Label>
                    <InfoValue>{lastUpdatedDates[themeSelector]?.toLocaleDateString()}</InfoValue>
                </InfoRowContainer>
            )}
        </MapInfoSummaryLegendContainer>
    );
}

export default connect(mapStateToProps)(MapInfoSummaryLegend);

const MapInfoSummaryLegendContainer = styled.div`
    padding: 15px 20px;
    border-radius: 12px;
    background-color: #ffffff;
    width: 100%;
`;

const InfoRowContainer = styled.div`
    display: flex;
    gap: 4px;
    width: 100%;
    margin-bottom: 10px;
`;

const Label = styled.span`
    font-weight: bold;
    white-space: nowrap;
    width: fit-content;
    font-size: 20px;
    font-family: sans-serif;
`;

const InfoValue = styled.span`
    white-space: nowrap;
    width: 100%;
    font-size: 20px;
`;

const DataFilterContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
`;

const DataFilterRowContainer = styled.div`
    display: flex;
    gap: 5px;
    width: 100%;
    margin-bottom: 10px;
`;

const DataFilterValue = styled.span`
    width: 100%;
    font-size: 20px;
`;
