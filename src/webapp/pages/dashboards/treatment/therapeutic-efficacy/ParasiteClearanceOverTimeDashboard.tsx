import { Card, Grid, Stack } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import TreatmentFilters from "../filters/TreatmentFilters";

const ParasiteClearanceOverTimeDashboard: React.FC = () => {
    const { t } = useTranslation();

    return (
        <React.Fragment>
            <Title>{t("common.dashboard.therapeuticEfficacySection.parasiteClearanceOverTime.title")}</Title>

            <Grid container spacing={2}>
                <Grid item md={3} xs={12}>
                    <Stack direction="column">
                        <TreatmentFilters></TreatmentFilters>
                        <StudiesCountCard elevation={0}></StudiesCountCard>
                    </Stack>
                </Grid>
                <Grid item md={9} xs={12}>
                    <DasboardCard elevation={0}></DasboardCard>
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

export default ParasiteClearanceOverTimeDashboard;

const DasboardCard = styled(Card)`
    height: 681px;
`;

const StudiesCountCard = styled(Card)`
    height: 60px;
`;

const Title = styled.h3`
    font-size: 23px;
    margin-bottom: 30px;
    color: #2ba681;
    text-transform: uppercase;
`;
