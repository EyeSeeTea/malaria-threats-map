import React from "react";
import styled from "styled-components";
import { Button, Typography, Link, Divider } from "@mui/material";
import WhoLogoBlue from "../../assets/img/who-logo-blue.png";
import { TFunction } from "react-i18next";

const FooterDiv = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    flex-wrap: wrap;
    margin: 58px 0 34px 0;
    flex: 1 auto;
`;

const StyledImage = styled.img`
    width: 100%;
    max-width: 150px;
    max-height: 50px;`

const Flex = styled.div`
    display: flex;
    flex-direction: column;
`;

const PrivacyCopyrightDiv = styled.div`
    padding: 22px 0;
    width: 1170px;
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
        font-size: 16px;
        background-color: #343434;
        font-weight: bold;
        text-align: center;
        margin: 0;
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
                <StyledImage src={WhoLogoBlue} alt="WHO Logo Blue" />
                <div>
                    <FooterHeader gutterBottom variant="body2">
                        {t("common.footer.policies.title")}
                    </FooterHeader>
                    <Link href="#" underline="none" variant="body1" textAlign="left" color="#343434">
                        {t("common.footer.policies.disclaimer")}
                    </Link>
                </div>
                <Flex>
                    <FooterHeader gutterBottom variant="body2">
                        {t("common.footer.other_who_resources.title")}
                    </FooterHeader>
                    {otherWhoResources.map((resource, id) => (
                        <Link 
                            key={id}
                            href="#"
                            underline="none"
                            variant="body1"
                            textAlign="left"
                            color="#343434"
                            style={{ margin: "5px 0" }}
                        >
                            {resource}
                        </Link>
                    ))}
                </Flex>
                <Flex style={{ justifyContent: "space-between" }}>
                    <Flex>
                        <FooterHeader gutterBottom variant="body2">
                            {t("common.footer.about_who_gmp.title")}
                        </FooterHeader>
                        {aboutWhoGmp.map((resource, id) => (
                            <Link
                                key={id}
                                href="#"
                                underline="none"
                                variant="body1"
                                textAlign="left"
                                color="#343434"
                                style={{ margin: "5px 0" }}
                            >
                                {resource}
                            </Link>
                        ))}
                    </Flex>
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
