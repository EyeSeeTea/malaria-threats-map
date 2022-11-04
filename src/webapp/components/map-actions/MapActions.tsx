import React from "react";

import { Card, Divider, List } from "@mui/material";
import { connect } from "react-redux";
import styled from "styled-components";
import ThemeMapActions from "./ThemeMapActions";
import MapTypeMapActions from "./MapTypeMapActions";
import LocationMapActions from "./LocationMapActions";
import DataMapActions from "./DataMapActions";

const RoundedCard = styled(Card)`
    padding: 0px;
    border-radius: 12px;
    width: 311px;
    overflow: visible;
`;

const StyledList = styled(List)`
    padding: 0px;
`;

const MapActions: React.FC = () => {
    return (
        <RoundedCard>
            <StyledList>
                <ThemeMapActions from={"map"} />
                <Divider />
                <MapTypeMapActions />
                <Divider />
                <DataMapActions from={"map"} />
                <Divider />
                <LocationMapActions />
            </StyledList>
        </RoundedCard>
    );
};

export default connect()(MapActions);
