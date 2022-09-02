import React from "react";
import { Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import ImageBanner from "../common/ImageBanner";
import styled from "styled-components";

const TitleContainer = styled(Container)`
    padding-top: 12vh;
    @media (max-width: 425px) {
        padding: 12vh 20px 0px 20px;
    }
`;

const BannerSection = () => {
    const { t } = useTranslation();

    return (
        <section>
            <ImageBanner height="40vh">
                <TitleContainer maxWidth="xl">
                    <Typography
                        variant="h3"
                        component="h1"
                        color="inherit"
                        textTransform="uppercase"
                        fontWeight="lighter"
                        sx={{ marginBottom: 2 }}
                    >
                        {t("common.aboutPage.title.first")}
                    </Typography>
                    <Typography variant="h3" component="h1" color="inherit" textTransform="uppercase" fontWeight="bold">
                        {t("common.aboutPage.title.second")}
                    </Typography>
                </TitleContainer>
            </ImageBanner>
        </section>
    );
};

export default BannerSection;
