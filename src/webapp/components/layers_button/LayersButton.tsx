import React from "react";
import { connect } from "react-redux";
import { Button, Card, Collapse } from "@mui/material";
import EndemicityLayerButton from "./EndemicityLayerButton";
import styled from "styled-components";
import LayersImage from "../../assets/img/layers.png";

const RoundedCard = styled(Card)`
    padding: 2px;
    overflow: visible;
    border-radius: 12px;
`;

const StyledButton = styled(Button)`
    text-transform: none;
    padding: 0px;
    border-radius: 12px;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
`;

const Image = styled.img`
    border-radius: 12px;
    width: 100px;
    height: 100px;
    object-fit: cover;
`;

const LayersButton: React.FC = () => {
    const [expanded, setExpanded] = React.useState<boolean>(false);

    const handleExpand = React.useCallback(() => {
        setExpanded(!expanded);
    }, [expanded]);

    return (
        <RoundedCard>
            <Row>
                <StyledButton onClick={handleExpand}>
                    <Image src={LayersImage} />
                </StyledButton>
                <Collapse in={expanded} timeout="auto" unmountOnExit orientation="horizontal">
                    <EndemicityLayerButton onClick={handleExpand} />
                </Collapse>
            </Row>
        </RoundedCard>
    );
};

export default connect()(LayersButton);
