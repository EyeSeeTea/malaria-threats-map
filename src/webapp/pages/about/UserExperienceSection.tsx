import React from "react";
import styled from "styled-components";
import { Typography, Button, Container, Grid } from "@mui/material";
import UXTesting from "../../assets/img/about-page/about-page-ux-testing.png";
import { useTranslation } from "react-i18next";

const Section = styled.section`
    background-color: #bbd7e8;
    padding: 10vmin 4vmin 4vmin 4vmin;
`;

const StyledAcknowledgementsButton = styled(Button)`
    &.MuiButton-root {
        color: white;
        background-color: #343434;
        font-weight: bold;
        max-width: 265px;
    }
`;

const UserExperienceSection = () => {
    const { t } = useTranslation();

    return (
        <Section>
            <Container maxWidth="xl">
                <Grid container spacing={6} sx={{ marginBottom: 6 }} justifyContent="center">
                    <Grid item md={2} xs={12}>
                        <img src={UXTesting} alt={t("common.aboutPage.userExperienceSection.title")} width={150} />
                    </Grid>
                    <Grid item md={10} xs={12}>
                        <Typography variant="h4" fontWeight="bold" sx={{ marginBottom: 4 }}>
                            {t("common.aboutPage.userExperienceSection.title")}
                        </Typography>
                        <Typography variant="body1" sx={{ marginBottom: 4 }}>
                            {t("common.aboutPage.userExperienceSection.p1")}
                        </Typography>
                        <Typography variant="body1" sx={{ marginBottom: 4 }}>
                            {t("common.aboutPage.userExperienceSection.p2")}
                        </Typography>
                        <StyledAcknowledgementsButton size="large" variant="contained">
                            {t("common.aboutPage.userExperienceSection.button")}
                        </StyledAcknowledgementsButton>
                    </Grid>
                </Grid>
            </Container>
        </Section>
    );
};

export default UserExperienceSection;
