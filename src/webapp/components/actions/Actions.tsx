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

const RoundedCard = styled(Card)`
    padding: 0px;
    border-radius: 12px;
    width: 300px;
`;

const StyledList = styled(List)`
    padding: 0px;
`;

const Actions: React.FC = () => {
    return (
        <RoundedCard>
            <StyledList>
                <ActionGroupItem title={"SELECT THEME"} actionGroupKey={"SELECT_THEME"}>
                    <TopicSelector />
                </ActionGroupItem>
                <Divider />
                <ActionGroupItem title={"SELECT MAP TYPE"} actionGroupKey={"SELECT_MAP_TYPE"}>
                    <MapTypesSelector />
                </ActionGroupItem>
                <Divider />
                <ActionGroupItem title={"FILTER DATA"} actionGroupKey={"FILTER_DATA"}>
                    <FiltersContent />
                </ActionGroupItem>
                <Divider />
                <ActionGroupItem title={"FILTER LOCATION (OPTIONAL)"} actionGroupKey={"FILTER_LOCATION"}>
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

export default connect()(Actions);
