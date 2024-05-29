import React from "react";
import styled from "styled-components";
import { Container } from "@mui/material";
import ContentsFilterSection from "./ContentsFilterSection";
import { useDashboards } from "../context/useDashboards";
import CountryContextStudies from "../common/country-context/CountryContextStudies";
import { CountryContext } from "../types";
import PhenotypicInsecticideResistanceStudies from "./phenotypic-insecticide-resistance/PhenotypicInsecticideResistanceStudies";
import { MolecularMechanismDetection, PhenotypicInsecticideResistance } from "./types";
import MolecularMechanismDetectionStudies from "./molecular-mechanism-detection/MolecularMechanismDetectionStudies";

const PreventionDashboards: React.FC = () => {
    const { dashboardsPreventionStudies, theme } = useDashboards();

    const [countryContext, setCountryContext] = React.useState<CountryContext>("country-context");
    const [phenotypicInsecticideResistance, setPhenotypicInsecticideResistance] =
        React.useState<PhenotypicInsecticideResistance>("phenotypic-insecticide-resistance");

    const [molecularMechanismDetection, setMolecularMechanismDetection] = React.useState<MolecularMechanismDetection>(
        "molecular-mechanism-detection"
    );

    return (
        <React.Fragment>
            <Container maxWidth="lg">
                {dashboardsPreventionStudies && (
                    <ContentsFilterSection
                        countryContext={countryContext}
                        phenotypicInsecticideResistance={phenotypicInsecticideResistance}
                        molecularMechanismDetection={molecularMechanismDetection}
                        onCountryContextChange={setCountryContext}
                        onPhenotypicInsecticideResistanceChange={setPhenotypicInsecticideResistance}
                        onMolecularMechanismDetectionChange={setMolecularMechanismDetection}
                    />
                )}
            </Container>
            <DashboardSection>
                {dashboardsPreventionStudies && (
                    <Container maxWidth="xl">
                        <CountryContextStudies theme={theme} />
                    </Container>
                )}
            </DashboardSection>
            <DashboardSection>
                {dashboardsPreventionStudies && (
                    <Container maxWidth="xl">
                        <PhenotypicInsecticideResistanceStudies />
                    </Container>
                )}
            </DashboardSection>
            <DashboardSection>
                {dashboardsPreventionStudies && (
                    <Container maxWidth="xl">
                        <MolecularMechanismDetectionStudies />
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
