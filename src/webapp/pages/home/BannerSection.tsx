import React from "react";
import { Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import ImageBanner from "../common/ImageBanner";
import styled from "styled-components";

const TitleContainer = styled(Container)`
    padding-top: 10vh;
`;

const StyledImageBanner = styled(ImageBanner)`
    background-repeat: repeat-x;
    height: 700px;
    @media (max-width: 1800px) {
        height: 73vh;
    }
    @media (max-width: 768px) {
        height: 68vh;
    }
`;

const BannerSection = () => {
    const { t } = useTranslation();

    return (
        <section>
            <StyledImageBanner>
                <TitleContainer maxWidth="xl">
                    <Typography variant="h2" color={"inherit"} textTransform="uppercase">
                        Malaria
                    </Typography>
                    <Typography variant="h2" color={"inherit"} textTransform="uppercase" fontWeight="bold">
                        Threats Map
                    </Typography>
                    <Typography variant="h5" color={"inherit"} marginTop="27px">
                        {t("common.homepage.subtitle")}
                    </Typography>
                </TitleContainer>
            </StyledImageBanner>
        </section>
    );
};

export default BannerSection;
