import React from "react";
import styled from "styled-components";
import { Button, AppBar, Toolbar, Box, Container, Hidden, IconButton, Drawer } from "@mui/material";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";
import { Menu as MenuIcon } from "@mui/icons-material";

interface DirectionProps {
    flexDirection: "column" | "row";
}

const MenuContainer = styled(Box)<DirectionProps>`
    display: flex;
    flex-direction: ${({ flexDirection }) => flexDirection};
`;

const MenuItemContainer = styled.div<DirectionProps>`
    margin-right: ${({ flexDirection }) => (flexDirection === "row" ? "80px" : "0px")};
`;

const StyledAppBar = styled(AppBar)`
    background-color: white;
`;

const StyledToolbar = styled(Toolbar)`
    padding: 0px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const StyledLink = styled(NavLink)<DirectionProps>`
    width: ${({ flexDirection }) => (flexDirection === "row" ? "auto" : "100%")};
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
          color: #2FB3AF;
          font-weight: bold;
          letter-spacing: 0;
          padding-bottom: 10px;
          border-bottom: 5px solid #2FB3AF;
          border-radius: 0;
          cursor;
          transition: none;
      }

`;

const MenuItems: React.FC<DirectionProps> = ({ flexDirection }) => {
    const { t } = useTranslation();

    return (
        <>
            <MenuItemContainer flexDirection={flexDirection}>
                <Button component={StyledLink} to="/">
                    {t("common.homepage.menu.home")}
                </Button>
            </MenuItemContainer>
            <MenuItemContainer flexDirection={flexDirection}>
                <Button component={StyledLink} to="/tools">
                    {t("common.homepage.menu.tools")}
                </Button>
            </MenuItemContainer>
            <MenuItemContainer flexDirection={flexDirection}>
                <Button component={StyledLink} to="/about">
                    {t("common.homepage.menu.about")}
                </Button>
            </MenuItemContainer>
            <MenuItemContainer flexDirection={flexDirection}>
                <Button component={StyledLink} to="/contact">
                    {t("common.homepage.menu.contact")}
                </Button>
            </MenuItemContainer>
            <MenuItemContainer flexDirection={flexDirection}>
                <Button component={StyledLink} to="/share-data">
                    {t("common.homepage.menu.share_data")}
                </Button>
            </MenuItemContainer>
        </>
    );
};

const Header = () => {
    const [drawerOpen, setDrawerOpen] = React.useState(false);

    const toggleDrawer = React.useCallback(() => {
        setDrawerOpen(!drawerOpen);
    }, [drawerOpen]);

    return (
        <>
            <StyledAppBar>
                <Container maxWidth="xl">
                    <StyledToolbar>
                        <Hidden lgUp>
                            <IconButton color="inherit" onClick={toggleDrawer}>
                                <MenuIcon />
                            </IconButton>
                        </Hidden>
                        <Hidden lgDown>
                            <MenuContainer flexDirection="row">
                                <MenuItems flexDirection="row" />
                            </MenuContainer>
                            <LanguageSelector />
                        </Hidden>
                    </StyledToolbar>
                </Container>
            </StyledAppBar>
            <Drawer variant="temporary" anchor="left" open={drawerOpen} sx={{ width: 400 }} onClose={toggleDrawer}>
                <MenuContainer flexDirection="column">
                    <MenuItems flexDirection="column" />
                </MenuContainer>
                <LanguageSelector />
            </Drawer>
        </>
    );
};

export default Header;
