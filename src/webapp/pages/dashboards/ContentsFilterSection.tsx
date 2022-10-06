import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import { Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import Select from "react-select";
import { CountryContext, MolecularMarker, TherapeuticEfficacy } from "./types";
import { useDashboards } from "./context/useDashboards";

const countryContextOptions: Option<CountryContext>[] = [
    { label: i18next.t("common.dashboard.contentsSection.countryOptions.countryContext"), value: "country-context" },
    {
        label: i18next.t("common.dashboard.contentsSection.countryOptions.epidemiologicalProfile"),
        value: "epidemiological-profile",
    },
    { label: i18next.t("common.dashboard.contentsSection.countryOptions.majorPlasmodium"), value: "major-plasmodium" },
];

const therapeuticEfficacyOptions: Option<TherapeuticEfficacy>[] = [
    {
        label: i18next.t("common.dashboard.contentsSection.therapeuticResultsOptions.therapeuticEfficacy"),
        value: "therapeutic-efficacy",
    },
    {
        label: i18next.t("common.dashboard.contentsSection.therapeuticResultsOptions.summaryTreatmentFailures"),
        value: "summary-treatment-failures",
    },
    {
        label: i18next.t("common.dashboard.contentsSection.therapeuticResultsOptions.treatmentFailureRates"),
        value: "treatment-failure-rates",
    },
    {
        label: i18next.t("common.dashboard.contentsSection.therapeuticResultsOptions.parasiteClearanceRates"),
        value: "parasite-clearance-rates",
    },
];

const molecularMarkerOptions: Option<MolecularMarker>[] = [
    {
        label: i18next.t("common.dashboard.contentsSection.molecularResultsOptions.molecularMarker"),
        value: "molecular-marker",
    },
    {
        label: i18next.t("common.dashboard.contentsSection.molecularResultsOptions.summaryMolecularMarker"),
        value: "summary-molecular-marker",
    },
];
const scrollToSection = (id: string) => {
    document.querySelector(`#${id}`)?.scrollIntoView({
        block: "center",
        behavior: "smooth",
    });
};

export const ContentsFilterSection: React.FC = () => {
    const { t } = useTranslation();
    const {
        countryContext,
        therapeuticEfficacy,
        molecularMarker,
        onCountryContextChange,
        onTherapeuticEfficacyChange,
        onMolecularMarkerChange,
    } = useDashboards();

    const handleCountryContextChange = useCallback(
        (option: Option<CountryContext>) => {
            onCountryContextChange(option.value);
            scrollToSection(option.value);
        },
        [onCountryContextChange]
    );

    const handleTherapeuticChange = useCallback(
        (option: Option<TherapeuticEfficacy>) => {
            onTherapeuticEfficacyChange(option.value);
            scrollToSection(option.value);
        },
        [onTherapeuticEfficacyChange]
    );

    const handleMolecularChange = useCallback(
        (option: Option<MolecularMarker>) => {
            onMolecularMarkerChange(option.value);
            scrollToSection(option.value);
        },
        [onMolecularMarkerChange]
    );

    const countryContextValue = useMemo(
        () => countryContextOptions.find(item => item.value === countryContext),
        [countryContext]
    );

    const countryTherapeutictValue = useMemo(
        () => therapeuticEfficacyOptions.find(item => item.value === therapeuticEfficacy),
        [therapeuticEfficacy]
    );

    const molecularValue = useMemo(
        () => molecularMarkerOptions.find(item => item.value === molecularMarker),
        [molecularMarker]
    );

    return (
        <Grid container spacing={3} mt={2} justifyContent="center" alignItems={"center"} sx={{ marginBottom: 4 }}>
            <Grid item md={"auto"} xs={12}>
                <SectionTitle>{t("common.dashboard.contentsSection.title")}</SectionTitle>
            </Grid>
            <Grid item md={3} xs={12}>
                <Select
                    options={countryContextOptions}
                    value={countryContextValue}
                    onChange={handleCountryContextChange}
                    placeholder={"Country Context"}
                    styles={selectStyles}
                />
            </Grid>
            <Grid item md={3} xs={12}>
                <Select
                    options={therapeuticEfficacyOptions}
                    value={countryTherapeutictValue}
                    onChange={handleTherapeuticChange}
                    placeholder={"Therapeutic efficacy study results"}
                    styles={selectStyles}
                />
            </Grid>
            <Grid item md={3} xs={12}>
                <Select
                    options={molecularMarkerOptions}
                    value={molecularValue}
                    onChange={handleMolecularChange}
                    placeholder={"Molecular marker study results"}
                    styles={selectStyles}
                />
            </Grid>
        </Grid>
    );
};

export default ContentsFilterSection;

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

const SectionTitle = styled(Typography)`
    font-weight: bold;
    text-transform: uppercase;
    font-size: 10px;
`;

export type Option<T> = {
    label: string;
    value: T;
};
