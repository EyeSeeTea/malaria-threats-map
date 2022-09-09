import React from "react";
import styled from "styled-components";
import { Container } from "@mui/material";
import ContentsFilterSection from "./ContentsFilterSection";
import TreatmentEfficacyStudies from "./therapeutic-efficacy/TreatmentEfficacyStudies";
import { useDashboards } from "../context/useDashboards";
import MolecularMarkerStudies from "./molecular-marker/MolecularMarkerStudies";
import CountryContextStudies from "../common/country-context/CountryContextStudies";
import { MolecularMarker, TherapeuticEfficacy } from "./types";
import { CountryContext } from "../types";

const TreatmentDashboards: React.FC = () => {
    const { dashboardsTreatmentStudies, theme } = useDashboards();

    const [countryContext, setCountryContext] = React.useState<CountryContext>("all");
    const [therapeuticEfficacy, setTherapeuticEfficacy] = React.useState<TherapeuticEfficacy>("all");
    const [molecularMarker, setMolecularMarker] = React.useState<MolecularMarker>("all");

    return (
        <React.Fragment>
            <Container maxWidth="lg">
                <ContentsFilterSection
                    countryContext={countryContext}
                    therapeuticEfficacy={therapeuticEfficacy}
                    molecularMarker={molecularMarker}
                    onCountryContextChange={setCountryContext}
                    onTherapeuticEfficacyChange={setTherapeuticEfficacy}
                    onMolecularMarkerChange={setMolecularMarker}
                />
            </Container>
            <DashboardSection>
                {dashboardsTreatmentStudies && (
                    <Container maxWidth="xl">
                        <CountryContextStudies countryContext={countryContext} theme={theme} />
                    </Container>
                )}
            </DashboardSection>
            <DashboardSection>
                {dashboardsTreatmentStudies && (
                    <Container maxWidth="xl">
                        <TreatmentEfficacyStudies therapeuticEfficacy={therapeuticEfficacy} />
                    </Container>
                )}
            </DashboardSection>

            <DashboardSection>
                {dashboardsTreatmentStudies && (
                    <Container maxWidth="xl">
                        <MolecularMarkerStudies molecularMarker={molecularMarker} />
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
