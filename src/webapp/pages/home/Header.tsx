import React from "react";
import styled from "styled-components";
import { Button, AppBar, Toolbar, Box } from "@mui/material";
import { TFunction } from "react-i18next";
import LanguageSelectorSelect from "../../components/LanguageSelectorSelect";

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

interface HeaderProps {
    t: TFunction<"translation", undefined>;
}

const Header = ({ t }: HeaderProps) => {
    const classes = {
        icon: { marginRight: 5 },
        menuOptionBox: { flexGrow: 1, display: { xs: "flex" }, width: "60%", margin: "auto" },
        languageSelectorBox: { flexGrow: 0 },
        appBar: { backgroundColor: "white" },
    };
    return (
        <StickyMenu>
            <Box>
                <AppBar position="sticky" sx={classes.appBar}>
                    <StyledToolbar>
                        <Box sx={classes.menuOptionBox}>
                            <StyledButton>{t("common.homepage.menu.home")}</StyledButton>
                            <StyledButton>{t("common.homepage.menu.tools")}</StyledButton>
                            <StyledButton>{t("common.homepage.menu.about")}</StyledButton>
                            <StyledButton>{t("common.homepage.menu.contact")}</StyledButton>
                            <StyledButton>{t("common.homepage.menu.share_data")}</StyledButton>
                        </Box>
                        <Box sx={classes.languageSelectorBox}>
                            <LanguageSelectorSelect section="homeItem" />
                        </Box>
                    </StyledToolbar>
                </AppBar>
            </Box>
        </StickyMenu>
    );
};

export default Header;
