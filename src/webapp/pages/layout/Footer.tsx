import React from "react";
import styled from "styled-components";
import { Button, Typography, Link, Grid, Container, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import WhoLogoBlue from "../../components/WhoLogoBlue";
import InitialDisclaimer from "../../components/InitialDisclaimer";
import { sendAnalytics } from "../../utils/analytics";

const FooterContainer = styled(Container)`
    padding: 22px;
`;

const PrivacyCopyrightStack = styled(Stack)`
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
        @media (max-width: 425px) {
            font-size: 12px;
        }
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
    const [openDisclaimer, setOpenDisclaimer] = React.useState(false);

    const handleClickOpenDisclaimer = () => {
        sendAnalytics({ type: "event", category: "menu", action: "disclaimer" });
        setOpenDisclaimer(true);
    };

    const handleCloseDisclaimer = () => {
        setOpenDisclaimer(false);
    };

    const otherWhoResources = [
        {
            label: t("common.footer.other_who_resources.resource1"),
            link: "https://www.who.int/teams/global-malaria-programme/guidelines-for-malaria",
        },
        {
            label: t("common.footer.other_who_resources.resource2"),
            link: "https://www.who.int/teams/global-malaria-programme/reports",
        },
        {
            label: t("common.footer.other_who_resources.resource3"),
            link: "https://www.who.int/teams/global-malaria-programme/surveillance/malaria-threats-map",
        },
    ];

    const aboutWhoGmp = [
        {
            label: t("common.footer.about_who_gmp.resource1"),
            link: "https://www.who.int/teams/global-malaria-programme",
        },
        {
            label: t("common.footer.about_who_gmp.resource2"),
            link: "mailto:gmp-maps@who.int",
        },
    ];

    const subscribeNewsletterLink =
        "https://www.who.int/teams/global-malaria-programme/about/previous-issues-of-the-newsletter";
    const privacyPolicyLink = "https://www.who.int/about/policies/privacy";

    return (
        <footer>
            <FooterContainer maxWidth="xl" sx={{ padding: 3 }}>
                <Grid container rowSpacing={3} columnSpacing={2} sx={{ paddingTop: 2, paddingBottom: 3 }}>
                    <Grid item lg={2} md={6} xs={12}>
                        <Column>
                            <ColumnTitle gutterBottom variant="h6">
                                {t("common.footer.policies.title")}
                            </ColumnTitle>
                            <StyledLink onClick={handleClickOpenDisclaimer} variant="body1" sx={{ cursor: "pointer" }}>
                                {t("common.footer.policies.disclaimer")}
                            </StyledLink>
                        </Column>
                    </Grid>
                    <Grid item lg={3} md={6} xs={12}>
                        <Column>
                            <ColumnTitle gutterBottom variant="h6">
                                {t("common.footer.other_who_resources.title")}
                            </ColumnTitle>
                            {otherWhoResources.map(({ label, link }, id) => (
                                <StyledLink key={id} href={link} variant="body1" target={"_blank"}>
                                    {label}
                                </StyledLink>
                            ))}
                        </Column>
                    </Grid>
                    <Grid item lg={3} md={6} xs={12}>
                        <Column>
                            <ColumnTitle gutterBottom variant="h6">
                                {t("common.footer.about_who_gmp.title")}
                            </ColumnTitle>
                            <Column>
                                {aboutWhoGmp.map(({ label, link }, id) => (
                                    <StyledLink key={id} href={link} variant="body1" target={"_blank"}>
                                        {label}
                                    </StyledLink>
                                ))}
                            </Column>
                            <a
                                href={subscribeNewsletterLink}
                                target={"_blank"}
                                rel="noreferrer"
                                style={{ textDecoration: "none" }}
                            >
                                <StyledNewsletterButton size="large" variant="contained">
                                    {t("common.footer.subscribe_newsletter")}
                                </StyledNewsletterButton>
                            </a>
                        </Column>
                    </Grid>
                </Grid>
                <PrivacyCopyrightStack direction={{ xs: "column", sm: "row" }} gap={1}>
                    <Column>
                        <WhoLogoBlue />
                    </Column>
                    <Stack direction="row" alignItems="center" gap={3}>
                        <a
                            href={privacyPolicyLink}
                            target={"_blank"}
                            rel="noreferrer"
                            style={{ textDecoration: "none" }}
                        >
                            <Typography color={"black"}>{t("common.footer.privacy")}</Typography>
                        </a>
                        <Typography variant="body1" textAlign="center">
                            {t("disclaimer.p1bLinkText", { year: new Date().getFullYear() })}
                        </Typography>
                    </Stack>
                </PrivacyCopyrightStack>
            </FooterContainer>
            <InitialDisclaimer open={openDisclaimer} handleClose={handleCloseDisclaimer} />
        </footer>
    );
};

export default Footer;
