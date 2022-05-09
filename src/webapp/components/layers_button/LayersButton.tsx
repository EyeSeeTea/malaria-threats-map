import React from "react";
import { connect } from "react-redux";
import { Button, Card, Collapse } from "@mui/material";
import EndemicityLayerButton from "./EndemicityLayerButton";
import styled from "styled-components";

const RoundedCard = styled(Card)`
    padding: 2px;
    border-radius: 12px;
    overflow: visible;
`;

const StyledButton = styled(Button)`
    text-transform: none;
    width: 100px;
    height: 100px;
    border-radius: 12px;
    background-color: cornflowerblue;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
`;

const LayersButton: React.FC = () => {
    const [expanded, setExpanded] = React.useState<boolean>(false);

    const handleExpand = React.useCallback(() => {
        setExpanded(!expanded);
    }, [expanded]);

    return (
        <RoundedCard>
            <Row>
                <StyledButton onClick={handleExpand} />
                <Collapse in={expanded} timeout="auto" unmountOnExit orientation="horizontal">
                    <EndemicityLayerButton />
                </Collapse>
            </Row>
        </RoundedCard>
    );
};

export default connect()(LayersButton);
