import React from "react";
import { Container, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import HomepageMap from "../../assets/img/homepage-map.png";
import styled from "styled-components";

const ImageBanner = styled.div`
    display: flex;
    background: linear-gradient(90deg, #bbd7e8 0%, #bbd7e800 100%), url(${HomepageMap});
    background-position: right;
    height: 30vh;
    min-height: 260px;
`;

const TitleContainer = styled(Container)`
    display: flex;
    align-items: center;
`;

const BannerSection = () => {
    const { t } = useTranslation();

    return (
        <section>
            <ImageBanner>
                <TitleContainer maxWidth="xl">
                    <Stack>
                        <Typography
                            variant="h2"
                            component="h1"
                            color="inherit"
                            textTransform="uppercase"
                            fontWeight="lighter"
                            sx={{ marginBottom: 2 }}
                        >
                            {t("common.aboutPage.title.first")} <br></br>
                        </Typography>
                        <Typography
                            variant="h2"
                            component="h1"
                            color="inherit"
                            textTransform="uppercase"
                            fontWeight="bold"
                        >
                            {t("common.aboutPage.title.second")}
                        </Typography>
                    </Stack>
                </TitleContainer>
            </ImageBanner>
        </section>
    );
};

export default BannerSection;
