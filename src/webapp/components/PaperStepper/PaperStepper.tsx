import { Paper, Stepper, StepperProps } from "@mui/material";
import React from "react";
import styled from "styled-components";

const StyledStepper = styled(Stepper)`
    padding: 24px;
`;

interface PaperStepperProps extends StepperProps {}

const PaperStepper: React.FC<PaperStepperProps> = ({ children, ...rest }) => {
    return (
        <Paper elevation={0}>
            <StyledStepper {...rest}>{children}</StyledStepper>
        </Paper>
    );
};

export default PaperStepper;
