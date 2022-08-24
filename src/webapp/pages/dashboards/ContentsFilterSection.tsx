import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import { Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Option } from "../../components/BasicSelect";
import i18next from "i18next";
import Select from "react-select";

const countryContextOptions: Option[] = [
    { label: i18next.t("common.dashboard.contentsSection.countryOptions.countryContext"), value: "all" },
    {
        label: i18next.t("common.dashboard.contentsSection.countryOptions.epidemiologicalProfile"),
        value: "epidemiological-profile",
    },
    { label: i18next.t("common.dashboard.contentsSection.countryOptions.majorPlasmodium"), value: "major-plasmodium" },
];

const therapeuticResultsOptions: Option[] = [
    {
        label: i18next.t("common.dashboard.contentsSection.therapeuticResultsOptions.therapeuticEfficacy"),
        value: "all",
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

const molecularResultsOptions: Option[] = [
    { label: i18next.t("common.dashboard.contentsSection.molecularResultsOptions.molecularMarker"), value: "all" },
    {
        label: i18next.t("common.dashboard.contentsSection.molecularResultsOptions.summaryMolecularMarker"),
        value: "summary-molecular-marker",
    },
];

interface ContentsFilterSectionProps {
    selectedCountryContext: string;
    selectedTherapeutic: string;
    selectedMolecular: string;
    onCountryContextChange: (countryContext: string) => void;
    onTherapeuticChange: (therapeutic: string) => void;
    onMolecularChange: (molecular: string) => void;
}

export const ContentsFilterSection: React.FC<ContentsFilterSectionProps> = ({
    selectedCountryContext,
    selectedTherapeutic,
    selectedMolecular,
    onCountryContextChange,
    onTherapeuticChange,
    onMolecularChange,
}) => {
    const { t } = useTranslation();

    const handleCountryContextChange = useCallback(
        (option: Option) => onCountryContextChange(option.value),
        [onCountryContextChange]
    );

    const handleTherapeuticChange = useCallback(
        (option: Option) => onTherapeuticChange(option.value),
        [onTherapeuticChange]
    );

    const handleMolecularChange = useCallback((option: Option) => onMolecularChange(option.value), [onMolecularChange]);

    const countryContextValue = useMemo(
        () => countryContextOptions.find(item => item.value === selectedCountryContext),
        [selectedCountryContext]
    );

    const countryTherapeutictValue = useMemo(
        () => therapeuticResultsOptions.find(item => item.value === selectedTherapeutic),
        [selectedTherapeutic]
    );

    const molecularValue = useMemo(
        () => molecularResultsOptions.find(item => item.value === selectedMolecular),
        [selectedMolecular]
    );

    return (
        <Grid container spacing={3} mt={2} justifyContent="center" alignItems={"center"}>
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
                    options={therapeuticResultsOptions}
                    value={countryTherapeutictValue}
                    onChange={handleTherapeuticChange}
                    placeholder={"Therapeutic efficacy study results"}
                    styles={selectStyles}
                />
            </Grid>
            <Grid item md={3} xs={12}>
                <Select
                    options={molecularResultsOptions}
                    value={molecularValue}
                    onChange={handleMolecularChange}
                    placeholder={"Molecular marker study results"}
                    styles={selectStyles}
                />
            </Grid>
        </Grid>
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

const SectionTitle = styled(Typography)`
    font-weight: bold;
    text-transform: uppercase;
    font-size: 10px;
`;
