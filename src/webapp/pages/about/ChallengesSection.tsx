import React from "react";
import styled from "styled-components";
import { Typography, Tabs, Tab, Container, Grid } from "@mui/material";
import DonorsOption from "../../assets/img/about-page/about-page-donors-option.png";
import { useTranslation } from "react-i18next";

const Section = styled.section`
    padding: 10vmin 4vmin 4vmin 4vmin;
`;

const StyledTab = styled(Tab)`
    &.MuiTab-root {
        font-size: 18px;
        color: #1899cc;
        background-color: #f2f5f7;
        margin-right: 32px;
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
    }
`;

const TabContent = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-left: 32px;
    @media (max-width: 900px) {
        padding-left: 0px;
    }
`;

const TabFooter = styled.div`
    display: flex;
    justify-content: flex-end;
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

const ChallengesSection: React.FC = () => {
    const { t } = useTranslation();
    const [value, setValue] = React.useState(0);

    const tabs = React.useMemo(
        () => [
            {
                name: t("common.aboutPage.challengesSection.tab1.name"),
                image: DonorsOption,
                text: t("common.aboutPage.challengesSection.tab1.text"),
            },
            {
                name: t("common.aboutPage.challengesSection.tab2.name"),
                image: DonorsOption,
                text: t("common.aboutPage.challengesSection.tab2.text"),
            },
            {
                name: t("common.aboutPage.challengesSection.tab3.name"),
                image: DonorsOption,
                text: t("common.aboutPage.challengesSection.tab3.text"),
            },
            {
                name: t("common.aboutPage.challengesSection.tab4.name"),
                image: DonorsOption,
                text: t("common.aboutPage.challengesSection.tab4.text"),
            },
            {
                name: t("common.aboutPage.challengesSection.tab5.name"),
                image: DonorsOption,
                text: t("common.aboutPage.challengesSection.tab5.text"),
            },
        ],
        [t]
    );

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Section>
            <Container maxWidth="xl">
                <Typography variant="h4" fontWeight="bold" color="inherit" marginBottom="6vmin">
                    {t("common.aboutPage.challengesSection.title")}
                </Typography>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons
                    TabIndicatorProps={{ style: { background: "transparent" } }}
                    sx={{ marginBottom: 6 }}
                >
                    {tabs.map((tab, index) => {
                        return <StyledTab key={index} label={tab.name} value={index} />;
                    })}
                </Tabs>
                {tabs.map((tab, index) => {
                    return (
                        <TabPanel key={index} value={value} index={index}>
                            <Grid
                                container
                                spacing={2}
                                sx={{ marginTop: 4, marginBottom: 4 }}
                                alignItems="center"
                                justifyContent="space-between"
                            >
                                <Grid item md={4} xs={12}>
                                    <img src={tab.image} alt={tab.name} width="100%" />
                                </Grid>
                                <Grid
                                    item
                                    md={8}
                                    xs={12}
                                    alignContent="center"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <TabContent>
                                        <Typography variant="h6" fontWeight="bold" color="inherit">
                                            {tab.name}
                                        </Typography>
                                        <Typography variant="body1" color="#343434" margin="16px 0">
                                            {tab.text}
                                        </Typography>
                                        <TabFooter>
                                            <Typography variant="body1" color="#343434" padding="4px 20px 20px">
                                                {t("common.aboutPage.challengesSection.tabFooter.name")}
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                color="#636463"
                                                fontWeight="bold"
                                                padding="4px 20px 20px"
                                            >
                                                {t("common.aboutPage.challengesSection.tabFooter.globalFund")}
                                            </Typography>
                                        </TabFooter>
                                    </TabContent>
                                </Grid>
                            </Grid>
                        </TabPanel>
                    );
                })}
            </Container>
        </Section>
    );
};

export default ChallengesSection;
