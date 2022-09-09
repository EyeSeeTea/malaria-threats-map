import React from "react";
import styled from "styled-components";
import { Container } from "@mui/material";
import ContentsFilterSection from "./ContentsFilterSection";
import { useDashboards } from "../context/useDashboards";
import CountryContextStudies from "../common/country-context/CountryContextStudies";
import { CountryContext } from "../types";

const TreatmentDashboards: React.FC = () => {
    const { dashboardsTreatmentStudies, theme } = useDashboards();

    const [countryContext, setCountryContext] = React.useState<CountryContext>("all");

    return (
        <React.Fragment>
            <Container maxWidth="lg">
                <ContentsFilterSection countryContext={countryContext} onCountryContextChange={setCountryContext} />
            </Container>
            <DashboardSection>
                {dashboardsTreatmentStudies && (
                    <Container maxWidth="xl">
                        <CountryContextStudies countryContext={countryContext} theme={theme} />
                    </Container>
                )}
            </DashboardSection>
        </React.Fragment>
    );
};

export default TreatmentDashboards;

const DashboardSection = styled.section`
    background: #00000012;
    margin: 32px 0px;
`;
