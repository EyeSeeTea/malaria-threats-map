import React from "react";
import styled from "styled-components";
import { Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import ThemeSelectionSection from "./ThemeSelectionSection";
import ContentsFilterSection from "./ContentsFilterSection";
import SecondaryLayout from "../secondary-layout/SecondaryLayout";
import TreatmentEfficacyStudies from "./treatment/therapeutic-efficacy/TreatmentEfficacyStudies";
import { useDashboards } from "./context/useDashboards";
import MolecularMarkerStudies from "./treatment/molecular-marker/MolecularMarkerStudies";

const StyledContainer = styled.div`
    background-color: #43cea4;
    display: flex;
    width: 100%;
    height: 400px;
`;

const DashboardsPageContent: React.FC = () => {
    const { t } = useTranslation();

    const { dashboardsTreatmentStudies } = useDashboards();

    return (
        <SecondaryLayout>
            <StyledContainer>
                <Container maxWidth="md">
                    <Typography mt={"90px"} fontSize={"40px"} fontWeight="bold">
                        {t("common.dashboard.title")}
                    </Typography>
                </Container>
            </StyledContainer>
            <Container maxWidth="md" sx={{ marginTop: "-200px" }}>
                <ThemeSelectionSection />
            </Container>
            <Container maxWidth="lg">
                <ContentsFilterSection />
            </Container>
            <DashboardSection>
                {dashboardsTreatmentStudies && (
                    <Container maxWidth="xl">
                        <TreatmentEfficacyStudies />
                    </Container>
                )}
            </DashboardSection>

            <DashboardSection>
                {dashboardsTreatmentStudies && (
                    <Container maxWidth="xl">
                        <MolecularMarkerStudies />
                    </Container>
                )}
            </DashboardSection>
        </SecondaryLayout>
    );
};

export default DashboardsPageContent;

const DashboardSection = styled.section`
    background: #00000012;
    margin: 32px 0px;
`;
