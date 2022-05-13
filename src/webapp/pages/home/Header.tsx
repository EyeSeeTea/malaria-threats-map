import React from "react";
import styled from "styled-components";
import { Button, AppBar, Toolbar, Box } from "@mui/material";
import { TFunction } from "react-i18next";
import { HomepageIntegrationReactSelect } from "../../components/BasicSelect";
import { changeLanguage } from "../../config/i18next";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

const LANGUAGES = [
    {
        value: "en",
        label: "Eng",
        code: "en",
    },
    {
        value: "es",
        label: "Esp",
        code: "es",
    },
    {
        value: "fr",
        label: "Fran",
        code: "fr",
    },
];
const StickyMenu = styled.div`
    position: relative;
    bottom: 0;
    top: 0;
    right: 0;
    left: 0;
`;

const StyledToolbar = styled(Toolbar)`
    &.MuiToolbar-root {
        width: 85%;
        margin: auto;
        @media (min-width: 600px) {
            padding: 0 70px;
            min-height: 50px;
        }
    }
`;

const StyledButton = styled(Button)`
    &.MuiButton-root {
        padding: 15px 40px;
        color: black;
        letter-spacing: 0.235px;
        &:hover {
            border: none;
            color: #2FB3AF;
            font-weight: bold;
            padding-bottom: 10px;
            letter-spacing: 0;
            border-bottom: 5px solid #2FB3AF;
            border-radius: 0;
            cursor;
            transition: none;
        }
    }
`;

const LanguageSelectorBox = styled(Box)`
    flex-grow: 0;
`;

const MenuOptionBox = styled(Box)`
    flex-grow: 1;
    width: 60%;
    margin: auto;
    @media (min-width: 600px) {
        display: flex;
    }
`;

const StyledAppBar = styled(AppBar)`
    background-color: white;
`;

interface HeaderProps {
    t: TFunction<"translation", undefined>;
}

const Header = ({ t }: HeaderProps) => {
    const [language, setLanguage] = React.useState(i18next.language || window.localStorage.i18nextLng);
    function handleChange(selection: any) {
        const language = selection.value;
        changeLanguage(language);
        setLanguage(language);
    }

    useTranslation();

    return (
        <StickyMenu>
            <Box>
                <StyledAppBar position="sticky">
                    <StyledToolbar>
                        <MenuOptionBox>
                            <StyledButton>{t("common.homepage.menu.home")}</StyledButton>
                            <StyledButton>{t("common.homepage.menu.tools")}</StyledButton>
                            <StyledButton>{t("common.homepage.menu.about")}</StyledButton>
                            <StyledButton>{t("common.homepage.menu.contact")}</StyledButton>
                            <StyledButton>{t("common.homepage.menu.share_data")}</StyledButton>
                        </MenuOptionBox>
                        <LanguageSelectorBox>
                            <HomepageIntegrationReactSelect
                                id={"language"}
                                suggestions={LANGUAGES}
                                onChange={handleChange}
                                value={LANGUAGES.find(lg => lg.value === language)}
                            />
                        </LanguageSelectorBox>
                    </StyledToolbar>
                </StyledAppBar>
            </Box>
        </StickyMenu>
    );
};

export default Header;
