import React from "react";
import { connect } from "react-redux";
import { Button, Card, Collapse } from "@mui/material";
import EndemicityLayerButton from "./EndemicityLayerButton";
import styled from "styled-components";
import LayersImage from "../../assets/img/layers.png";
import LayersIcon from "@mui/icons-material/Layers";
import { useTranslation } from "react-i18next";

const RoundedCard = styled(Card)`
    padding: 2px;
    overflow: visible;
    border-radius: 12px;
`;

const StyledButton = styled(Button)`
    text-transform: none;
    padding: 0px;
    border-radius: 12px;
    width: 70px;
    height: 70px;
    background-repeat: no-repeat;
    background-size: cover;
    background-image: url("${LayersImage}");
`;

const StyledText = styled.span`
    color: white;
    font-size: 11px;
    font-weight: bold;
    position: absolute;
    bottom: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 50px;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.4));
    border-radius: 12px;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
`;

const LayersButton: React.FC = () => {
    const [expanded, setExpanded] = React.useState<boolean>(false);
    const { t } = useTranslation();

    const handleExpand = React.useCallback(() => {
        setExpanded(!expanded);
    }, [expanded]);

    return (
        <RoundedCard>
            <Row>
                <StyledButton onClick={handleExpand}>
                    <StyledText>
                        <LayersIcon sx={{ marginRight: 0.5 }} /> {t("common.layers")}
                    </StyledText>
                </StyledButton>
                <Collapse in={expanded} timeout="auto" unmountOnExit orientation="horizontal">
                    <EndemicityLayerButton onClick={handleExpand} />
                </Collapse>
            </Row>
        </RoundedCard>
    );
};

export default connect()(LayersButton);
