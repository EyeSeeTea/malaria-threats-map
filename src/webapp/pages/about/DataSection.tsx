import React from "react";
import { Container, Grid, Typography } from "@mui/material";
import DataGraphic from "../../assets/img/about-page/data-graphic.svg";
import { useTranslation } from "react-i18next";

const DataSection = () => {
    const { t } = useTranslation();

    return (
        <section>
            <Container maxWidth="xl">
                <Grid container spacing={2} sx={{ marginTop: 4, marginBottom: 4 }} alignItems="center">
                    <Grid item md={6} xs={12}>
                        <Typography variant="h4" fontWeight="bold" color="inherit" marginBottom="25px">
                            {t("common.aboutPage.dataSection.title")}
                        </Typography>
                        <Typography variant="body1" color={"inherit"}>
                            {t("common.aboutPage.dataSection.content")}
                        </Typography>
                    </Grid>
                    <Grid item md={6} xs={12} alignContent="center" alignItems="center" justifyContent="center">
                        <img src={DataGraphic} width="100%" alt="graph" />
                    </Grid>
                </Grid>
            </Container>
        </section>
    );
};

export default DataSection;
