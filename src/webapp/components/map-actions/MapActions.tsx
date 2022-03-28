import React from "react";

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

const RoundedCard = styled(Card)`
    padding: 0px;
    border-radius: 12px;
    width: 311px;
`;

const StyledList = styled(List)`
    padding: 0px;
`;

const MapActions: React.FC = () => {
    const { t } = useTranslation();

    return (
        <RoundedCard>
            <StyledList>
                <ActionGroupItem title={t("mapActions.theme")} actionGroupKey={"THEME"}>
                    <TopicSelector />
                </ActionGroupItem>
                <Divider />
                <ActionGroupItem title={t("mapActions.mapType")} actionGroupKey={"MAP_TYPE"}>
                    <MapTypesSelector />
                </ActionGroupItem>
                <Divider />
                <ActionGroupItem title={t("mapActions.data")} actionGroupKey={"DATA"}>
                    <FiltersContent />
                </ActionGroupItem>
                <Divider />
                <ActionGroupItem title={t("mapActions.location")} actionGroupKey={"LOCATION"}>
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

export default connect()(MapActions);
