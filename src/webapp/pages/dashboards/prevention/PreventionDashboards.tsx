import React from "react";
import styled from "styled-components";
import { Container } from "@mui/material";
import ContentsFilterSection from "./ContentsFilterSection";
import { useDashboards } from "../context/useDashboards";
import CountryContextStudies from "../common/country-context/CountryContextStudies";
import { CountryContext } from "../types";
import PhenotypicInsecticideResistanceStudies from "./phenotypic-insecticide-resistance/PhenotypicInsecticideResistanceStudies";
import { PhenotypicInsecticideResistance } from "./types";

const PreventionDashboards: React.FC = () => {
    const { dashboardsPreventionStudies, theme } = useDashboards();

    const [countryContext, setCountryContext] = React.useState<CountryContext>("all");
    const [phenotypicInsecticideResistance, setPhenotypicInsecticideResistance] =
        React.useState<PhenotypicInsecticideResistance>("all");

    return (
        <React.Fragment>
            <Container maxWidth="lg">
                <ContentsFilterSection
                    countryContext={countryContext}
                    phenotypicInsecticideResistance={phenotypicInsecticideResistance}
                    onCountryContextChange={setCountryContext}
                    onPhenotypicInsecticideResistanceChange={setPhenotypicInsecticideResistance}
                />
            </Container>
            <DashboardSection>
                {dashboardsPreventionStudies && (
                    <Container maxWidth="xl">
                        <CountryContextStudies countryContext={countryContext} theme={theme} />
                    </Container>
                )}
            </DashboardSection>
            <DashboardSection>
                {dashboardsPreventionStudies && (
                    <Container maxWidth="xl">
                        <PhenotypicInsecticideResistanceStudies
                            phenotypicInsecticideResistance={phenotypicInsecticideResistance}
                        />
                    </Container>
                )}
            </DashboardSection>
        </React.Fragment>
    );
};

export default PreventionDashboards;

const DashboardSection = styled.section`
    background: #00000012;
    margin: 32px 0px;
`;
