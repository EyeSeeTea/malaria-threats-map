import React, { useEffect } from "react";
import styled from "styled-components";
import { Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import ThemeSelectionSection from "./ThemeSelectionSection";
import SecondaryLayout from "../secondary-layout/SecondaryLayout";
import { useDashboards } from "./context/useDashboards";
import TreatmentDashboards from "./treatment/TreatmentDashboards";
import PreventionDashboards from "./prevention/PreventionDashboards";
import { useLocation, useSearchParams } from "react-router-dom";
import { DashboardsThemeOptions } from "./types";

const StyledContainer = styled.div`
    background-color: #43cea4;
    display: flex;
    width: 100%;
    height: 400px;
`;

const DashboardsPageContent: React.FC = () => {
    const { t } = useTranslation();
    const { search } = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const { theme, onThemeChange, onSelectedCountriesChange, selectedCountries } = useDashboards();

    useEffect(() => {
        const params = new URLSearchParams(search);
        const theme = params.get("theme");
        const country = params.get("country");

        onThemeChange(theme as DashboardsThemeOptions);
        onSelectedCountriesChange([country]);
        setSearchParams(params, { replace: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (selectedCountries.length > 0) {
            searchParams.set("country", selectedCountries[0]);
            setSearchParams(searchParams, { replace: true });
        } else {
            searchParams.delete("country");
            setSearchParams(searchParams, { replace: true });
        }
    }, [searchParams, selectedCountries, setSearchParams]);

    useEffect(() => {
        if (theme) {
            searchParams.set("theme", theme);
            setSearchParams(searchParams, { replace: true });
        } else {
            searchParams.delete("theme");
            setSearchParams(searchParams, { replace: true });
        }
    }, [searchParams, setSearchParams, theme]);

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
