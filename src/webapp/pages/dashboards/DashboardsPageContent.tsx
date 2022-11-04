import React from "react";
import styled from "styled-components";
import { Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import ThemeSelectionSection from "./ThemeSelectionSection";
import SecondaryLayout from "../secondary-layout/SecondaryLayout";
import { useDashboards } from "./context/useDashboards";
import TreatmentDashboards from "./treatment/TreatmentDashboards";
import PreventionDashboards from "./prevention/PreventionDashboards";

const StyledContainer = styled.div`
    background-color: #43cea4;
    display: flex;
    width: 100%;
    height: 400px;
`;

const DashboardsPageContent: React.FC = () => {
    const { t } = useTranslation();

    const { theme } = useDashboards();

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
            {theme === "prevention" ? <PreventionDashboards /> : <TreatmentDashboards />}
        </SecondaryLayout>
    );
};

export default DashboardsPageContent;
