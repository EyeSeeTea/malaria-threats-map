import React from "react";
import styled from "styled-components";
import { Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { MolecularMarker, TherapeuticEfficacy } from "./types";
import { CountryContext } from "../types";
import CountryContextFilter from "../common/dashboards-filters/CountryContextFilter";
import TherapeuticEfficacyFilter from "./dashboards-filters/TherapeuticEfficacyFilter";
import MolecularMarkerFilter from "./dashboards-filters/MolecularMarkerFilter";

interface ContentsFilterSectionProps {
    countryContext: CountryContext;
    therapeuticEfficacy: TherapeuticEfficacy;
    molecularMarker: MolecularMarker;
    onCountryContextChange: (value: CountryContext) => void;
    onTherapeuticEfficacyChange: (value: TherapeuticEfficacy) => void;
    onMolecularMarkerChange: (value: MolecularMarker) => void;
}

export const ContentsFilterSection: React.FC<ContentsFilterSectionProps> = ({
    countryContext,
    therapeuticEfficacy,
    molecularMarker,
    onCountryContextChange,
    onTherapeuticEfficacyChange,
    onMolecularMarkerChange,
}) => {
    const { t } = useTranslation();

    return (
        <Grid container spacing={3} mt={2} justifyContent="center" alignItems={"center"} sx={{ marginBottom: 4 }}>
            <Grid item md={"auto"} xs={12}>
                <SectionTitle>{t("common.dashboard.dashboardsFilterSection.title")}</SectionTitle>
            </Grid>
            <Grid item md={3} xs={12}>
                <CountryContextFilter theme="treatment" value={countryContext} onChange={onCountryContextChange} />
            </Grid>
            <Grid item md={3} xs={12}>
                <TherapeuticEfficacyFilter value={therapeuticEfficacy} onChange={onTherapeuticEfficacyChange} />
            </Grid>
            <Grid item md={3} xs={12}>
                <MolecularMarkerFilter value={molecularMarker} onChange={onMolecularMarkerChange} />
            </Grid>
        </Grid>
    );
};

export default ContentsFilterSection;

const SectionTitle = styled(Typography)`
    font-weight: bold;
    text-transform: uppercase;
    font-size: 10px;
`;
