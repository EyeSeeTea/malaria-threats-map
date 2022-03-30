import React, { useMemo } from "react";

import { Card, Divider, List } from "@mui/material";
import { connect } from "react-redux";
import FiltersContent from "../filters/container/FiltersContent";
import CountrySelector from "../filters/CountrySelector";
import RegionSelector from "../filters/RegionSelector";
import SiteSelector from "../filters/SiteSelector";
import SubRegionSelector from "../filters/SubRegionSelector";
import ActionGroupItem from "./ActionGroupItem";
import styled from "styled-components";
import TopicSelector from "../TopicSelector";
import MapTypesSelector from "../MapTypesSelector";
import { useTranslation } from "react-i18next";
import { selectRegion, selectTheme } from "../../store/reducers/base-reducer";
import { State } from "../../store/types";
import { selectPreventionFilters } from "../../store/reducers/prevention-reducer";
import { selectInvasiveFilters } from "../../store/reducers/invasive-reducer";
import { selectDiagnosisFilters } from "../../store/reducers/diagnosis-reducer";
import { selectTreatmentFilters } from "../../store/reducers/treatment-reducer";
import { preventionSuggestions } from "../filters/PreventionMapTypesSelector";
import { diagnosisSuggestions } from "../filters/DiagnosisMapTypesSelector";
import { invasiveSuggestions } from "../filters/InvasiveMapTypesSelector";
import { treatmentSuggestions } from "../filters/TreatmentMapTypesSelector";
import { DiagnosisIcon, InvasiveIcon, PreventionIcon, TreatmentIcon } from "../Icons";

const RoundedCard = styled(Card)`
    padding: 0px;
    border-radius: 12px;
    width: 311px;
    overflow: visible;
`;

const StyledList = styled(List)`
    padding: 0px;
`;

const Label = styled.span`
    font-weight: bold;
`;

const Value = styled.span`
    font-weight: normal;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 0px;
    padding: 0px;
`;

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    preventionFilters: selectPreventionFilters(state),
    invasiveFilters: selectInvasiveFilters(state),
    diagnosisFilters: selectDiagnosisFilters(state),
    treatmentFilters: selectTreatmentFilters(state),
    region: selectRegion(state),
});

type StateProps = ReturnType<typeof mapStateToProps>;

const MapActions: React.FC<StateProps> = ({
    theme,
    preventionFilters,
    invasiveFilters,
    diagnosisFilters,
    treatmentFilters,
    region,
}) => {
    const { t } = useTranslation();

    // const currentFilters = useMemo(() => {
    //     switch (theme) {
    //         case "prevention": {
    //             return preventionFilters;
    //         }
    //         case "diagnosis": {
    //             return diagnosisFilters;
    //         }
    //         case "invasive": {
    //             return invasiveFilters;
    //         }
    //         case "treatment": {
    //             return treatmentFilters;
    //         }
    //     }
    // }, []);

    const themeValue = useMemo(() => {
        switch (theme) {
            case "prevention": {
                return (
                    <Row>
                        <Label>{t("mapActions.theme")}:&nbsp;</Label>
                        <PreventionIcon selected size={30} />
                        <Value>{t("common.themes.prevention")}</Value>
                    </Row>
                );
            }
            case "diagnosis": {
                return (
                    <Row>
                        <Label>{t("mapActions.theme")}:&nbsp;</Label>
                        <DiagnosisIcon selected size={30} />
                        <Value>{t("common.themes.diagnosis")}</Value>
                    </Row>
                );
            }
            case "invasive": {
                return (
                    <Row>
                        <Label>{t("mapActions.theme")}:&nbsp;</Label>
                        <InvasiveIcon selected size={30} />
                        <Value>{t("common.themes.invasive")}</Value>
                    </Row>
                );
            }
            case "treatment": {
                return (
                    <Row>
                        <Label>{t("mapActions.theme")}:&nbsp;</Label>
                        <TreatmentIcon selected size={30} />
                        <Value>{t("common.themes.treatment")}</Value>
                    </Row>
                );
            }
        }

        return;
    }, [theme, t]);

    const selectedMapType = useMemo(() => {
        switch (theme) {
            case "prevention": {
                return preventionSuggestions[preventionFilters.mapType].title;
            }
            case "diagnosis": {
                return diagnosisSuggestions[diagnosisFilters.mapType].title;
            }
            case "invasive": {
                return invasiveSuggestions[invasiveFilters.mapType].title;
            }
            case "treatment": {
                return treatmentSuggestions[treatmentFilters.mapType].title;
            }
        }
    }, [theme, preventionFilters.mapType, diagnosisFilters.mapType, invasiveFilters.mapType, treatmentFilters.mapType]);

    const selectedRegion = useMemo(() => {
        return region.region !== ""
            ? region.region
            : region.subRegion !== ""
            ? region.subRegion
            : region.siteLabel !== ""
            ? region.siteLabel
            : region.country !== ""
            ? region.country
            : undefined;
    }, [region]);

    return (
        <RoundedCard>
            <StyledList>
                <ActionGroupItem placeholder={t("mapActions.selectTheme")} actionGroupKey={"THEME"} value={themeValue}>
                    <TopicSelector />
                </ActionGroupItem>
                <Divider />
                <ActionGroupItem
                    placeholder={t("mapActions.selectMapType")}
                    value={
                        selectedMapType && (
                            <span>
                                <Label>{t("mapActions.mapType")}:&nbsp;</Label>
                                <Value>{t(selectedMapType)}</Value>
                            </span>
                        )
                    }
                    actionGroupKey={"MAP_TYPE"}
                >
                    {theme !== "diagnosis" && theme !== "invasive" && <MapTypesSelector />}
                </ActionGroupItem>
                <Divider />
                <ActionGroupItem placeholder={t("mapActions.data")} actionGroupKey={"DATA"}>
                    <FiltersContent />
                </ActionGroupItem>
                <Divider />
                <ActionGroupItem
                    placeholder={t("mapActions.selectLocation")}
                    actionGroupKey={"LOCATION"}
                    value={
                        selectedRegion && (
                            <span>
                                <Label>{t("mapActions.location")}:&nbsp;</Label>
                                <Value>{t(selectedRegion)}</Value>
                            </span>
                        )
                    }
                >
                    <>
                        <RegionSelector />
                        <SubRegionSelector />
                        <CountrySelector />
                        <SiteSelector />
                    </>
                </ActionGroupItem>
            </StyledList>
        </RoundedCard>
    );
};

export default connect(mapStateToProps)(MapActions);
