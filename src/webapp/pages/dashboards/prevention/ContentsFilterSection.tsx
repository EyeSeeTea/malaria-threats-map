import React from "react";
import styled from "styled-components";
import { Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { CountryContext } from "../types";
import CountryContextFilter from "../common/dashboards-filters/CountryContextFilter";
import PhenotypicInsecticideResistanceFilter from "./dashboards-filters/PhenotypicInsecticideResistanceFilter";
import { MolecularMechanismDetection, PhenotypicInsecticideResistance } from "./types";
import MolecularMechanishDetectionFilter from "./dashboards-filters/MolecularMechanishDetectionFilter";

interface ContentsFilterSectionProps {
    countryContext: CountryContext;
    phenotypicInsecticideResistance: PhenotypicInsecticideResistance;
    molecularMechanismDetection: MolecularMechanismDetection;
    onCountryContextChange: (value: CountryContext) => void;
    onPhenotypicInsecticideResistanceChange: (value: PhenotypicInsecticideResistance) => void;
    onMolecularMechanismDetectionChange: (value: MolecularMechanismDetection) => void;
}

export const ContentsFilterSection: React.FC<ContentsFilterSectionProps> = ({
    countryContext,
    phenotypicInsecticideResistance,
    molecularMechanismDetection,
    onCountryContextChange,
    onPhenotypicInsecticideResistanceChange,
    onMolecularMechanismDetectionChange,
}) => {
    const { t } = useTranslation();

    return (
        <Grid container spacing={3} mt={2} justifyContent="center" alignItems={"center"} sx={{ marginBottom: 4 }}>
            <Grid item md={"auto"} xs={12}>
                <SectionTitle>{t("common.dashboard.dashboardsFilterSection.title")}</SectionTitle>
            </Grid>
            <Grid item md={3} xs={12}>
                <CountryContextFilter theme="prevention" value={countryContext} onChange={onCountryContextChange} />
            </Grid>
            <Grid item md={3} xs={12}>
                <PhenotypicInsecticideResistanceFilter
                    value={phenotypicInsecticideResistance}
                    onChange={onPhenotypicInsecticideResistanceChange}
                />
            </Grid>
            <Grid item md={3} xs={12}>
                <MolecularMechanishDetectionFilter
                    value={molecularMechanismDetection}
                    onChange={onMolecularMechanismDetectionChange}
                />
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
