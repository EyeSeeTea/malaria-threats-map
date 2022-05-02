import React from "react";
import styled from "styled-components";
import { Button, Typography, Link, Divider } from "@mui/material";
import WhoLogoBlue from "../assets/img/who-logo-blue.png";
import { TFunction } from "react-i18next";

const FooterDiv = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    margin: 40px 0;
`;

const WhoLogoImg = styled.img`
    max-width: 100%;
    height: 55px;
`;

const Flex = styled.div`
    display: flex;
    flex-direction: column;
`;

const PrivacyCopyrightDiv = styled.div`
    padding: 25px 0;
    width: 85%;
    margin: auto;
    display: flex;
    justify-content: space-between;
`;

const FooterHeader = styled(Typography)`
    text-align: left;
    color: #636463;
    font-weight: bold;
`;

const StyledNewsletterButton = styled(Button)`
    &.MuiButton-root {
        color: white;
        font-size: 1rem;
        background-color: #343434;
        font-weight: bold;
        text-align: center;
        margin: auto 0;
    }
`;

interface FooterProps {
    t: TFunction<"translation", undefined>;
}

const Footer = ({ t }: FooterProps) => {
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
        <React.Fragment>
            <FooterDiv>
                <WhoLogoImg src={WhoLogoBlue} alt="WHO Logo Blue" />
                <div>
                    <FooterHeader gutterBottom variant="body1">
                        {t("common.footer.policies.title")}
                    </FooterHeader>
                    <Link href="#" underline="none" variant="h6" textAlign="left" color="#343434">
                        {t("common.footer.policies.disclaimer")}
                    </Link>
                </div>
                <Flex>
                    <FooterHeader gutterBottom variant="body1">
                        {t("common.footer.other_who_resources.title")}
                    </FooterHeader>
                    {otherWhoResources.map((resource, id) => (
                        <Link
                            key={id}
                            href="#"
                            underline="none"
                            variant="h6"
                            textAlign="left"
                            color="#343434"
                            style={{ margin: "5px 0" }}
                        >
                            {resource}
                        </Link>
                    ))}
                </Flex>
                <Flex>
                    <FooterHeader gutterBottom variant="body1">
                        {t("common.footer.about_who_gmp.title")}
                    </FooterHeader>
                    {aboutWhoGmp.map((resource, id) => (
                        <Link
                            key={id}
                            href="#"
                            underline="none"
                            variant="h6"
                            textAlign="left"
                            color="#343434"
                            style={{ margin: "5px 0" }}
                        >
                            {resource}
                        </Link>
                    ))}
                    <StyledNewsletterButton size="large" variant="contained">
                        {t("common.footer.subscribe_newsletter")}
                    </StyledNewsletterButton>
                </Flex>
            </FooterDiv>
            <Divider variant="fullWidth" />
            <PrivacyCopyrightDiv>
                <Link href="#" underline="none" variant="body1" textAlign="center" color="#343434">
                    {t("common.footer.privacy")}
                </Link>
                <Typography variant="body1" textAlign="center" color="#343434">
                    © 2021 WHO
                </Typography>
            </PrivacyCopyrightDiv>
        </React.Fragment>
    );
};

export default Footer;
