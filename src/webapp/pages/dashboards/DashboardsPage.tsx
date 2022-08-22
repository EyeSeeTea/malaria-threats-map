import React, { useState } from "react";
import styled from "styled-components";
import { Button, Container, Grid, ToggleButton, ToggleButtonGroup, Typography, Stack } from "@mui/material";
import Layout from "../layout/Layout";
import { PreventionIcon, TreatmentIcon } from "../../components/Icons";
import MultiFilter from "../../components/filters/common/MultiFilter";
import { useTranslation } from "react-i18next";
import { Option } from "../../components/BasicSelect";
import Select from "react-select";

type ThemeButtonProps = {
    theme: "prevention" | "treatment";
    selectedTheme: "prevention" | "treatment";
    label: string;
};

const StyledContainer = styled.div`
    background-color: #43cea4;
    display: flex;
    width: 100%;
    height: 400px;
`;

const FilterCard = styled.div`
    background-color: white;
    padding: 40px 90px;
    border-radius: 10px;
    box-shadow: 0px 5px 10px #00000029;
    margin-top: -200px;
    @media (max-width: 768px) {
        padding: 40px 20px;
    }
`;

const StyledToggleButton = styled(ToggleButton)`
    justify-content: flex-start;
    border-radius: 10px !important;
    &:not(:first-child) {
        margin-top: 10px !important;
        border-top: 1px solid rgba(0, 0, 0, 0.12) !important;
    }
`;

const StyledGenerateButton = styled(Button)`
    background-color: #43cea4;
    text-transform: uppercase;
    color: white;
    width: 70%;
    margin-left: auto;
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: small;
    @media (max-width: 768px) {
        width: 100%;
    }
    :hover {
        background-color: #91d3bf;
    }
`;

const SectionTitle = styled(Typography)`
    font-weight: bold;
    text-transform: uppercase;
    font-size: 10px;
`;

const ThemeButton = ({ theme, label, selectedTheme }: ThemeButtonProps) => {
    return (
        <Button
            sx={{ fontSize: "12px", color: "black", textTransform: "none", textAlign: "left" }}
            startIcon={
                theme === "prevention" ? (
                    <PreventionIcon selected={selectedTheme === "prevention"} />
                ) : (
                    <TreatmentIcon selected={selectedTheme === "treatment"} />
                )
            }
        >
            {label}
        </Button>
    );
};

const selectStyles = {
    control: (base: any) => ({
        ...base,
        fontSize: "10px",
        textTransform: "uppercase",
        fontWeight: "bold",
    }),
    menu: (base: any) => ({
        ...base,
        fontSize: "10px",
        textTransform: "uppercase",
        fontWeight: "bold",
    }),
};

export const DashboardsPage = () => {
    const { t } = useTranslation();
    const [theme, setTheme] = useState<"prevention" | "treatment">("prevention");
    const [selectedCountries, setSelectedCountries] = useState([]);
    const [countryContext, setCountryContext] = useState(null);
    const [therapeuticResults, setTherapeuticResults] = useState(null);
    const [molecularResults, setMolecularResults] = useState(null);

    const baseCountries = t("countries", { returnObjects: true });
    const countrySuggestions: any[] = Object.entries(baseCountries).map(([iso, name]) => ({
        label: name,
        value: iso,
    }));

    const countryOptions: Option[] = [
        { label: t("common.dashboard.contentsSection.countryOptions.countryContext"), value: "all" },
        {
            label: t("common.dashboard.contentsSection.countryOptions.epidemiologicalProfile"),
            value: "epidemiological-profile",
        },
        { label: t("common.dashboard.contentsSection.countryOptions.majorPlasmodium"), value: "major-plasmodium" },
    ];
    const therapeuticResultsOptions: Option[] = [
        { label: t("common.dashboard.contentsSection.therapeuticResultsOptions.therapeuticEfficacy"), value: "all" },
        {
            label: t("common.dashboard.contentsSection.therapeuticResultsOptions.summaryTreatmentFailures"),
            value: "summary-treatment-failures",
        },
        {
            label: t("common.dashboard.contentsSection.therapeuticResultsOptions.treatmentFailureRates"),
            value: "treatment-failure-rates",
        },
        {
            label: t("common.dashboard.contentsSection.therapeuticResultsOptions.parasiteClearanceRates"),
            value: "parasite-clearance-rates",
        },
    ];
    const molecularResultsOptions: Option[] = [
        { label: t("common.dashboard.contentsSection.molecularResultsOptions.molecularMarker"), value: "all" },
        {
            label: t("common.dashboard.contentsSection.molecularResultsOptions.summaryMolecularMarker"),
            value: "summary-molecular-marker",
        },
    ];

    return (
        <Layout>
            <StyledContainer>
                <Container maxWidth="md">
                    <Typography mt={"90px"} fontSize={"40px"} fontWeight="bold">
                        {t("common.dashboard.title")}
                    </Typography>
                </Container>
            </StyledContainer>
            <Container maxWidth="md">
                <FilterCard>
                    <Stack spacing={3}>
                        <Grid container spacing={5}>
                            <Grid item md={6} xs={12}>
                                <Stack spacing={1}>
                                    <SectionTitle>{t("common.dashboard.filtersSection.first.title")}</SectionTitle>
                                    <ToggleButtonGroup
                                        value={theme}
                                        exclusive
                                        onChange={(_, value) => setTheme(value)}
                                        aria-label="theme"
                                        orientation="vertical"
                                    >
                                        <StyledToggleButton value="prevention" aria-label="prevention theme">
                                            <ThemeButton
                                                theme={"prevention"}
                                                selectedTheme={theme}
                                                label={t("common.dashboard.filtersSection.first.buttonOne")}
                                            />
                                        </StyledToggleButton>
                                        <StyledToggleButton value="treatment" aria-label="treatment theme">
                                            <ThemeButton
                                                theme={"treatment"}
                                                selectedTheme={theme}
                                                label={t("common.dashboard.filtersSection.first.buttonTwo")}
                                            />
                                        </StyledToggleButton>
                                    </ToggleButtonGroup>
                                </Stack>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Stack>
                                    <SectionTitle>{t("common.dashboard.filtersSection.second.title")}</SectionTitle>
                                    <MultiFilter
                                        label={t("common.filters.select_country")}
                                        placeholder={t("common.filters.select_country")}
                                        options={countrySuggestions}
                                        onChange={value => value.length <= 5 && setSelectedCountries(value)}
                                        value={selectedCountries}
                                    />
                                    <Typography variant="caption" fontSize={"11px"}>
                                        {t("common.dashboard.filtersSection.second.helper")}
                                    </Typography>
                                    <StyledGenerateButton>Generate Dashboard</StyledGenerateButton>
                                    <Typography variant="caption" fontSize={"12px"} textAlign="right">
                                        {t("common.dashboard.filtersSection.second.lastUpdate")}{" "}
                                        {theme === "prevention" ? "03/08/2022" : "05/11/2021"}
                                    </Typography>
                                </Stack>
                            </Grid>
                        </Grid>
                        <Typography variant="caption" fontStyle={"italic"} color="slategray" lineHeight={1.4}>
                            {t("common.dashboard.filtersSection.note")}
                        </Typography>
                    </Stack>
                </FilterCard>
            </Container>
            <Container maxWidth="lg">
                <Grid container spacing={3} mt={2} justifyContent="center" alignItems={"center"}>
                    <Grid item md={"auto"} xs={12}>
                        <SectionTitle>{t("common.dashboard.contentsSection.title")}</SectionTitle>
                    </Grid>
                    <Grid item md={3} xs={12}>
                        <Select
                            options={countryOptions}
                            value={countryContext}
                            onChange={(option: any) => setCountryContext(option)}
                            placeholder={"Country Context"}
                            styles={selectStyles}
                        />
                    </Grid>
                    <Grid item md={3} xs={12}>
                        <Select
                            options={therapeuticResultsOptions}
                            value={therapeuticResults}
                            onChange={(option: any) => setTherapeuticResults(option)}
                            placeholder={"Therapeutic efficacy study results"}
                            styles={selectStyles}
                        />
                    </Grid>
                    <Grid item md={3} xs={12}>
                        <Select
                            options={molecularResultsOptions}
                            value={molecularResults}
                            onChange={(option: any) => setMolecularResults(option)}
                            placeholder={"Molecular marker study results"}
                            styles={selectStyles}
                        />
                    </Grid>
                </Grid>
            </Container>
        </Layout>
    );
};
