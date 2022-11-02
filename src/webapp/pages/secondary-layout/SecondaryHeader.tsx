import React from "react";
import styled from "styled-components";
import { AppBar, Toolbar, Box, IconButton, Typography, Button, Divider } from "@mui/material";
import { Menu as MenuIcon, CloseOutlined as CloseOutlinedIcon } from "@mui/icons-material";
import LeftSidebarMenu from "../../components/LeftSidebarMenu/LeftSidebarMenu";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { ReactNode } from "hoist-non-react-statics/node_modules/@types/react";
import { LanguageSelectorDialog } from "../../components/LanguageSelectorDialog";
import i18next from "i18next";
import { changeLanguage } from "../../config/i18next";

interface SecondaryHeaderProps {
    onDrawerOpenChange?: (open: boolean) => void;
    action?: ReactNode;
}

const SecondaryHeader: React.FC<SecondaryHeaderProps> = ({ onDrawerOpenChange, action }) => {
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [changeLanguageOpen, setChangeLanguageOpen] = React.useState(false);
    const [language, setLanguage] = React.useState(i18next.language || window.localStorage.i18nextLng);
    const { t } = useTranslation();

    const toggleDrawer = React.useCallback(() => {
        const value = !drawerOpen;

        setDrawerOpen(value);

        if (onDrawerOpenChange) {
            onDrawerOpenChange(value);
        }
    }, [drawerOpen, onDrawerOpenChange]);

    const handleLanguageClose = (value: string) => {
        changeLanguage(value);
        setLanguage(value);
        setChangeLanguageOpen(false);
    };

    const handleLanguageOpen = () => {
        setChangeLanguageOpen(true);
    };

    console.log({ language });

    return (
        <nav>
            <Box>
                <AppBar sx={{ backgroundColor: "white", zIndex: 1400 }}>
                    <StyledToolbar>
                        <Box sx={{ flexGrow: 1, display: { xs: "flex" } }}>
                            <Flex style={{ alignItems: "center" }}>
                                <IconButton onClick={toggleDrawer}>
                                    {drawerOpen ? <CloseOutlinedIcon /> : <MenuIcon />}
                                </IconButton>
                                <MenuTypography variant="h6">{t("common.topbar.menu")}</MenuTypography>
                            </Flex>
                            <Divider orientation="vertical" flexItem />
                            <Button component={StyledLink} to="/maps">
                                {t("common.topbar.maps")}
                            </Button>
                            <Button component={StyledLink} to="/dashboards">
                                {t("common.topbar.dashboards")}
                            </Button>
                            <Button component={StyledLink} to="/download">
                                {t("common.data_download.title")}
                            </Button>
                        </Box>
                        {action}
                    </StyledToolbar>
                </AppBar>
            </Box>

            <LeftSidebarMenu isMenuOpen={drawerOpen} handleClickOpen={handleLanguageOpen} />

            <LanguageSelectorDialog selectedValue={language} open={changeLanguageOpen} onClose={handleLanguageClose} />
        </nav>
    );
};

export default SecondaryHeader;

const StyledToolbar = styled(Toolbar)`
    &.MuiToolbar-root {
        padding: 0;
        @media (min-width: 600px) {
            padding: 0;
            min-height: 50px;
        }
    }
`;

const StyledLink = styled(NavLink)`
    text-decoration: none;
    padding: 15px;
    color: black;
    font-weight: normal;
    letter-spacing: 0.235px;
    &.active {
        font-weight: bold;
    }
    &:hover {
        border: none;
        color: #2fb3af;
        font-weight: bold;
        letter-spacing: 0;
        padding-bottom: 10px;
        border-bottom: 5px solid #2fb3af;
        border-radius: 0;
        cursor: pointer;
        transition: none;
    }
`;

const MenuTypography = styled(Typography)`
    padding-right: 17px;
    text-transform: uppercase;
    font-size: 0.875rem;
    line-height: 1.75;
    letter-spacing: 0.235;
`;

export const Flex = styled.div`
    display: flex;
`;
