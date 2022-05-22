import React from "react";
import styled from "styled-components";
import { Typography, Button, ButtonGroup, Divider } from "@mui/material";
import { ContentDiv } from "./AboutPage";
import DonorsOption from "../../assets/img/about-page/about-page-donors-option.png";

interface ChallengesProps {
    width: number;
}
const FlexColumnSpaceBetweenDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;
const TypesOfPeopleDiv = styled(FlexColumnSpaceBetweenDiv)`
    margin-top: 58px;
`;
const QuoteDetailsDiv = styled.div`
    display: flex;
    justify-content: flex-end;
`;
const PeopleTypeDivDiv = styled(FlexColumnSpaceBetweenDiv)`
    margin-left: 30px;
    margin-top: 20px;
`;

const StyledButtonGroup = styled(ButtonGroup)`
    display: flex;
    justify-content: space-between;
    margin: 50px 0;
    flex-wrap: wrap;
`;

const StyledButton = styled(Button)`
    background-color: #f2f5f7;
    color: #1899cc;
    font-weight: bold;
    box-shadow: none;
    border-radius: 5px;
    @media (max-width: 768px) {
        margin-top: 10px;
    }
`;
const ChallengesDiv = styled.div`
    display: flex;
    justify-content: space-between;
    @media (max-width: 1024px) {
        flex-direction: column;
    }
`;

const Challenges = ({ width }: ChallengesProps) => {
    return (
        <ContentDiv style={{ display: "flex" }} windowWidth={width}>
            <TypesOfPeopleDiv>
                <Typography variant="h4" fontWeight="bold" color={"inherit"} letterSpacing={0} textAlign="center">
                    Thousands of people use the Malaria Threats Map to understand challenges to malaria control and
                    elimination, access data and guide decision-making.
                </Typography>
                <StyledButtonGroup variant="outlined">
                    <StyledButton variant="contained">National Malaria Control Programmes</StyledButton>
                    <StyledButton variant="contained">NGOs</StyledButton>
                    <StyledButton variant="contained">Donors</StyledButton>
                    <StyledButton variant="contained">WHO Staff</StyledButton>
                    <StyledButton variant="contained">Researchers</StyledButton>
                </StyledButtonGroup>

                <ChallengesDiv>
                    <img src={DonorsOption} width={475} height={250} style={{ margin: "auto" }} alt="Donors" />
                    <PeopleTypeDivDiv>
                        <Typography variant="h6" fontWeight="bold" color="inherit">
                            Donors
                        </Typography>
                        <Typography variant="body2" color="#343434" margin="16px 0">
                            The MTM gives me access to the most recent public data on vector insecticide resistance –
                            this helps me make decisions around which insecticide products to fund for IRS and whether
                            standard LLINs or new Pyrethroid-PBO nets should be deployed. The interactivity of the
                            platform allows me to select the specific criteria that I am interested in – and then easily
                            export visualisations to facilitate discussions. No other platform is as comprehensive as
                            the MTM.
                        </Typography>
                        <QuoteDetailsDiv>
                            <Typography variant="body2" color="#343434" padding="4px 20px 20px">
                                Name
                            </Typography>
                            <Typography variant="body2" color="#636463" fontWeight="bold" padding="4px 20px 20px">
                                Global Fund
                            </Typography>
                        </QuoteDetailsDiv>
                    </PeopleTypeDivDiv>
                </ChallengesDiv>
            </TypesOfPeopleDiv>
            <Divider variant="middle" />
        </ContentDiv>
    );
};

export default Challenges;
