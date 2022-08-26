import React from "react";
import styled from "styled-components";
import { Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import ThemeSelectionSection from "./ThemeSelectionSection";
import ContentsFilterSection from "./ContentsFilterSection";
import SecondaryLayout from "../secondary-layout/SecondaryLayout";
import TreatmentEfficacyStudies from "./treatment/therapeutic-efficacy/TreatmentEfficacyStudies";
import DashboardProvider from "./context/DashboardProvider";

const StyledContainer = styled.div`
    background-color: #43cea4;
    display: flex;
    width: 100%;
    height: 400px;
`;

const DashboardsPage: React.FC = () => {
    const { t } = useTranslation();

    return (
        <SecondaryLayout>
            <DashboardProvider>
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
                    <Container maxWidth="xl">
                        <TreatmentEfficacyStudies />
                    </Container>
                </DashboardSection>
            </DashboardProvider>
        </SecondaryLayout>
    );
};

export default DashboardsPage;

const DashboardSection = styled.section`
    background: #00000012;
`;
