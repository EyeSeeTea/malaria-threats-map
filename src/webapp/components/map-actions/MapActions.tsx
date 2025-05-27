import React from "react";
import { Card, Divider, List } from "@mui/material";
import { connect } from "react-redux";
import styled from "styled-components";
import mapboxgl from "mapbox-gl";

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

type Props = {
    map: mapboxgl.Map;
    layerSource: string;
    isMinimizedVersion?: boolean;
};

const MapActions: React.FC<Props> = ({ isMinimizedVersion, map, layerSource }) => {
    return (
        <RoundedCard>
            <StyledList>
                <ThemeMapActions from={"map"} />
                <Divider />
                {!isMinimizedVersion && (
                    <>
                        <MapTypeMapActions />
                        <Divider />
                        <DataMapActions from={"map"} />
                        <Divider />
                        <LocationMapActions map={map} layerSource={layerSource} />
                    </>
                )}
            </StyledList>
        </RoundedCard>
    );
};

export default connect()(MapActions);
