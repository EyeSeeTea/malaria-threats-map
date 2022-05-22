import React from "react";
import styled from "styled-components";
import { Typography, Button } from "@mui/material";
import { Props, StyledImg } from "./AboutPage";
import UXTesting from "../../assets/img/about-page/about-page-ux-testing.png";

interface UserExperienceProps {
    width: number;
}

const FlexRowSpaceBetweenDiv = styled.div`
    display: flex;
    justify-content: space-between;
`;
const UserExperienceDiv = styled(FlexRowSpaceBetweenDiv)`
    height: 478px;
    margin: 64px auto;
    background-color: #bbd7e8;
`;
const FlexColumnSpaceBetweenDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;
const UserExperienceInnerDiv = styled.div<Props>`
    display: flex;
    height: ${props => `${props.windowWidth * 0.83 * 0.25}px`};
    width: ${props => `${props.windowWidth * 0.83 * 0.8}px`};
    margin: auto;
    @media (max-width: 1024px) {
        height: ${props => `${props.windowWidth * 0.83 * 0.4}px`};
    }
    @media (max-width: 768px) {
        height: 100%;
        flex-direction: column;
        justify-content: center;
    }
`;

const UserExperienceTextDiv = styled(FlexColumnSpaceBetweenDiv)`
    margin-left: 77px;
    @media (max-width: 768px) {
        margin-left: 0;
    }
`;
const StyledAcknowledgementsButton = styled(Button)`
    &.MuiButton-root {
        color: white;
        background-color: #343434;
        font-weight: bold;
        max-width: 265px;
    }
`;
const UserExperience = ({ width }: UserExperienceProps) => {
    return (
        <UserExperienceDiv>
            <UserExperienceInnerDiv windowWidth={width}>
                <StyledImg src={UXTesting} alt="user experience testing" maxWidth={151} maxHeight={151} />
                <UserExperienceTextDiv>
                    <Typography variant="h4" fontWeight="bold" color="inherit">
                        User experience testing
                    </Typography>
                    <Typography variant="body2" color="inherit">
                        We have recently undertaken a process of user experience testing and are grateful to all who
                        willingly gave of their time to contribute to the improvement of the MTM for all its users.{" "}
                    </Typography>
                    <Typography variant="body2" color="inherit">
                        This user testing has led to the addition of the home, about and contact pages, the creation of
                        the dashboards, a dedicated download interface, and a more streamlined map interface. We have
                        also identified additional areas of improvement, which we are working on. These include
                        increased guidance to facilitate decision-making, and additional map layers. We want to make
                        this tool the best it can be so that together we have the resources to control and eliminate
                        malaria.{" "}
                    </Typography>
                    <StyledAcknowledgementsButton size="large" variant="contained">
                        Acknowledgements List
                    </StyledAcknowledgementsButton>
                </UserExperienceTextDiv>
            </UserExperienceInnerDiv>
        </UserExperienceDiv>
    );
};

export default UserExperience;
