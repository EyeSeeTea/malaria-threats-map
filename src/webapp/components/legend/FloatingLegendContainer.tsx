import React from "react";
import { Card } from "@mui/material";
import { connect } from "react-redux";
import styled from "styled-components";
import Legend from "./Legend";

const RoundedCard = styled(Card)`
    padding: 0px;
    border-radius: 12px;
    width: 313px;
`;

const FloatingLegendContainer: React.FC<{ isMinimizedVersion?: boolean }> = ({ isMinimizedVersion }) => {
    return (
        <RoundedCard>
            <Legend isMinimizedVersion={isMinimizedVersion} />
        </RoundedCard>
    );
};

export default connect()(FloatingLegendContainer);
