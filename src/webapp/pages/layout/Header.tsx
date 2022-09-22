import React from "react";
import styled from "styled-components";
import { AppBar, Toolbar, Box, Container, Hidden, IconButton, Drawer } from "@mui/material";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";
import { Menu as MenuIcon } from "@mui/icons-material";
import NavMenu from "./NavMenu";

interface DirectionProps {
    flexDirection: "column" | "row";
}

const MenuContainer = styled(Box)<DirectionProps>`
    display: flex;
    flex-direction: ${({ flexDirection }) => flexDirection};
    align-items: center;
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

const MenuItems: React.FC<DirectionProps> = ({ flexDirection }) => {
    const { t } = useTranslation();

    const menus = React.useMemo(
        () => [
            { kind: "simple-menu" as const, name: t("common.homepage.menu.home"), path: "/" },
            {
                kind: "parent-menu" as const,
                name: t("common.homepage.menu.tools"),
                hoverPaddingRight: 23,
                submenus: [
                    { kind: "simple-menu" as const, name: t("common.homepage.tools_submenu.maps"), path: "/maps" },
                    { kind: "simple-menu" as const, name: t("common.homepage.tools_submenu.dashboards"), path: "/" },
                    { kind: "simple-menu" as const, name: t("common.homepage.tools_submenu.data_download"), path: "/" },
                ],
            },
            {
                kind: "parent-menu" as const,
                name: t("common.homepage.menu.stories"),
                hoverPaddingRight: 7,
                submenus: [
                    { kind: "simple-menu" as const, name: t("common.themes.prevention"), path: "/" },
                    { kind: "simple-menu" as const, name: t("common.themes.invasive"), path: "/" },
                    {
                        kind: "simple-menu" as const,
                        name: t("common.homepage.stories_submenu.antimalarial_drug_efficacy_and_resistance"),
                        path: "/",
                    },
                    {
                        kind: "simple-menu-trans" as const,
                        name: "common.homepage.stories_submenu.parasite_pfhrp_gene_deletions",
                        path: "/",
                    },
                ],
            },
            { kind: "simple-menu" as const, name: t("common.homepage.menu.about"), path: "/about" },
            { kind: "simple-menu" as const, name: t("common.homepage.menu.contact"), path: "/contact" },
            { kind: "simple-menu" as const, name: t("common.homepage.menu.share_data"), path: "/share-data" },
        ],
        [t]
    );

    return (
        <>
            {menus.map(menu => {
                return <NavMenu key={menu.name} menu={menu} flexDirection={flexDirection} t={t} />;
            })}
        </>
    );
};

const Header = () => {
    const [drawerOpen, setDrawerOpen] = React.useState(false);

    const toggleDrawer = React.useCallback(() => {
        setDrawerOpen(!drawerOpen);
    }, [drawerOpen]);

    return (
        <nav>
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
        </nav>
    );
};

export default Header;
