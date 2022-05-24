import React from "react";
import styled from "styled-components";
import { Typography, Divider, Box, Tabs, Tab } from "@mui/material";
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

const StyledTabs = styled(Tabs)`
    &.MuiTabs-root .MuiTabs-scroller .MuiTabs-flexContainer {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
    }
`;

const StyledTab = styled(Tab)`
    &.MuiTab-root {
        color: #1899cc;
        background-color: #f2f5f7;
        font-weight: bold;
        box-shadow: none;
        max-width: none;
        min-height: 40px;
        padding: 6px 30px;
        border-radius: 5px !important;
        &:hover,
        &:focus {
            background-color: #1899cc;
            color: white;
            box-shadow: none;
            border-radius: 5px;
        }
        &:active {
            background-color: #1899cc;
            color: white;
        }
        @media (max-width: 1024px) {
            margin-top: 20px;
        }
    }
`;
const ChallengesDiv = styled.div`
    display: flex;
    justify-content: space-between;
    @media (max-width: 1024px) {
        flex-direction: column;
    }
`;

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && <>{children}</>}
        </div>
    );
}
interface ChallengesInfoProps {
    index: number;
}
const ChallengesInfo = ({ index }: ChallengesInfoProps) => {
    const typesOfPeople = ["National Malaria Control Programmes", "NGOs", "Donors", "WHO Staff", "Researchers"];

    return (
        <ChallengesDiv>
            <img src={DonorsOption} width={475} height={250} style={{ margin: "auto" }} alt="Donors" />
            <PeopleTypeDivDiv>
                <Typography variant="h6" fontWeight="bold" color="inherit">
                    {typesOfPeople[index]}
                </Typography>
                <Typography variant="body2" color="#343434" margin="16px 0">
                    The MTM gives me access to the most recent public data on vector insecticide resistance – this helps
                    me make decisions around which insecticide products to fund for IRS and whether standard LLINs or
                    new Pyrethroid-PBO nets should be deployed. The interactivity of the platform allows me to select
                    the specific criteria that I am interested in – and then easily export visualisations to facilitate
                    discussions. No other platform is as comprehensive as the MTM.
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
    );
};
const Challenges = ({ width }: ChallengesProps) => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <ContentDiv style={{ display: "flex" }} windowWidth={width}>
            <TypesOfPeopleDiv>
                <Typography variant="h4" fontWeight="bold" color={"inherit"} letterSpacing={0} textAlign="center">
                    Thousands of people use the Malaria Threats Map to understand challenges to malaria control and
                    elimination, access data and guide decision-making.
                </Typography>
                <Box sx={{ margin: "44px 0" }}>
                    <StyledTabs
                        value={value}
                        onChange={handleChange}
                        TabIndicatorProps={{ style: { background: "transparent" } }}
                    >
                        <StyledTab label="National Malaria Control Programmes" value={0} />
                        <StyledTab label="NGOs" value={1} />
                        <StyledTab label="Donors" value={2} />
                        <StyledTab label="WHO Staff" value={3} />
                        <StyledTab label="Researchers" value={4} />
                    </StyledTabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <ChallengesInfo index={0} />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <ChallengesInfo index={1} />
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <ChallengesInfo index={2} />
                </TabPanel>
                <TabPanel value={value} index={3}>
                    <ChallengesInfo index={3} />
                </TabPanel>
                <TabPanel value={value} index={4}>
                    <ChallengesInfo index={4} />
                </TabPanel>
            </TypesOfPeopleDiv>
            <Divider variant="middle" />
        </ContentDiv>
    );
};

export default Challenges;
