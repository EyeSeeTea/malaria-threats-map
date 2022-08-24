import React, { useState } from "react";
import styled from "styled-components";
import { Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ThemeSelectionSection, ThemeOptions } from "./ThemeSelectionSection";
import { ContentsFilterSection } from "./ContentsFilterSection";
import SecondaryLayout from "../secondary-layout/SecondaryLayout";

const StyledContainer = styled.div`
    background-color: #43cea4;
    display: flex;
    width: 100%;
    height: 400px;
`;

export const DashboardsPage = () => {
    const { t } = useTranslation();
    const [theme, setTheme] = useState<ThemeOptions>("prevention");
    const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
    const [countryContext, setCountryContext] = useState<string>();
    const [therapeuticResults, setTherapeuticResults] = useState<string>();
    const [molecularResults, setMolecularResults] = useState<string>();

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
                <ThemeSelectionSection
                    theme={theme}
                    countries={selectedCountries}
                    onCountriesChange={setSelectedCountries}
                    onThemeChange={setTheme}
                />
            </Container>
            <Container maxWidth="lg">
                <ContentsFilterSection
                    selectedCountryContext={countryContext}
                    selectedTherapeutic={therapeuticResults}
                    selectedMolecular={molecularResults}
                    onCountryContextChange={setCountryContext}
                    onTherapeuticChange={setTherapeuticResults}
                    onMolecularChange={setMolecularResults}
                />
            </Container>
        </SecondaryLayout>
    );
};
