import React from "react";
import styled from "styled-components";
import { Button, Typography, Link, Divider, Grid, Container } from "@mui/material";
import { useTranslation } from "react-i18next";
import WhoLogoBlue from "../../components/WhoLogoBlue";

const FooterContainer = styled(Container)`
    padding: 22px;
`;

const PrivacyCopyrightDiv = styled.div`
    padding-top: 8px;
    padding-bottom: 16px;
    display: flex;
    justify-content: space-between;
`;

const Column = styled(Typography)`
    display: flex;
    flex-direction: column;
    height: 100%;
    flex: 1;
`;

const ColumnTitle = styled(Typography)`
    text-align: left;
    color: dimgray;
    font-weight: bold;
`;

const StyledNewsletterButton = styled(Button)`
    &.MuiButton-root {
        color: white;
        font-size: 16px;
        background-color: black;
        font-weight: bold;
        max-width: 355px;
        margin-top: 16px;
        padding-top: 15px;
        padding-bottom: 15px;
        padding-right: 20px;
        padding-left: 20px;
        white-space: nowrap;
    }
`;

const StyledLink = styled(Link)`
    color: black;
    &:hover {
        text-decoration: none;
    }
`;

const Footer = () => {
    const { t } = useTranslation();

    //I'll remove this once I get the actual links
    const otherWhoResources = [
        t("common.footer.other_who_resources.resource1"),
        t("common.footer.other_who_resources.resource2"),
        t("common.footer.other_who_resources.resource3"),
        t("common.footer.other_who_resources.resource4"),
        t("common.footer.other_who_resources.resource5"),
    ];

    const aboutWhoGmp = [t("common.footer.about_who_gmp.resource1"), t("common.footer.about_who_gmp.resource2")];

    return (
        <footer>
            <FooterContainer maxWidth="xl" sx={{ padding: 3 }}>
                <Grid container rowSpacing={3} columnSpacing={2} sx={{ paddingTop: 2, paddingBottom: 3 }}>
                    <Grid item lg={2} md={6} xs={12}>
                        <Column>
                            <WhoLogoBlue />
                        </Column>
                    </Grid>
                    <Grid item lg={2} md={6} xs={12}>
                        <Column>
                            <ColumnTitle gutterBottom variant="body2">
                                {t("common.footer.policies.title")}
                            </ColumnTitle>
                            <StyledLink href="#" variant="body1">
                                {t("common.footer.policies.disclaimer")}
                            </StyledLink>
                        </Column>
                    </Grid>
                    <Grid item lg={3} md={6} xs={12}>
                        <Column>
                            <ColumnTitle gutterBottom variant="body2">
                                {t("common.footer.other_who_resources.title")}
                            </ColumnTitle>
                            {otherWhoResources.map((resource, id) => (
                                <StyledLink key={id} href="#" variant="body1">
                                    {resource}
                                </StyledLink>
                            ))}
                        </Column>
                    </Grid>
                    <Grid item lg={3} md={6} xs={12}>
                        <Column>
                            <ColumnTitle gutterBottom variant="body2">
                                {t("common.footer.about_who_gmp.title")}
                            </ColumnTitle>
                            <Column>
                                {aboutWhoGmp.map((resource, id) => (
                                    <StyledLink key={id} href="#" variant="body1">
                                        {resource}
                                    </StyledLink>
                                ))}
                            </Column>
                            <StyledNewsletterButton size="large" variant="contained">
                                {t("common.footer.subscribe_newsletter")}
                            </StyledNewsletterButton>
                        </Column>
                    </Grid>
                </Grid>
                <Divider variant="fullWidth" sx={{ margin: "8px 0px" }} />
                <PrivacyCopyrightDiv>
                    <Link href="#" underline="none" variant="body1" textAlign="center" color="black">
                        {t("common.footer.privacy")}
                    </Link>
                    <Typography variant="body1" textAlign="center">
                        {t("disclaimer.p1bLinkText", { year: new Date().getFullYear() })}
                    </Typography>
                </PrivacyCopyrightDiv>
            </FooterContainer>
        </footer>
    );
};

export default Footer;
