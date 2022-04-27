import React from "react";
import styled from "styled-components";
import HomeIcon from "./Icons/HomeIcon";
import AboutIcon from "./Icons/AboutIcon";
import TakeATourIcon from "./Icons/TakeATourIcon";
import LanguageIcon from "./Icons/LanguageIcon";
import ContactIcon from "./Icons/ContactIcon";
import ShareDataIcon from "./Icons/ShareDataIcon";

import { Fab, Drawer, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const drawerWidth = 100;

const StyledFab = styled(Fab)`
    &.Fab-root {
        pointerevents: all;
        margin: 0.5px;
    }
    margin-bottom: 10px;
`;

const SidebarIconDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-transform: uppercase;
`;

const SideBarContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    height: 80%;
`;

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
}));

type Props = {
    isMenuOpen: boolean;
};
const LeftSidebarMenu = ({ isMenuOpen }: Props) => {
    const { t } = useTranslation();
    return (
        <Drawer
            sx={{
                width: drawerWidth,
                backgroundColor: "#EFF3F7",
                boxShadow: "0px 3px 26px #00000029",
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    boxSizing: "border-box",
                },
            }}
            variant="persistent"
            anchor="left"
            open={isMenuOpen}
        >
            <DrawerHeader></DrawerHeader>
            <SideBarContainer>
                <SidebarIconDiv>
                    <StyledFab id="home-button" size="small" color={"default"} title={t("common.sidebar.home")}>
                        <HomeIcon />
                    </StyledFab>
                    <Typography variant="caption" align="center">
                        {" "}
                        {t("common.sidebar.home")}
                    </Typography>
                </SidebarIconDiv>

                <SidebarIconDiv>
                    <StyledFab id="about-button" size="small" color={"default"} title={t("common.sidebar.about")}>
                        <AboutIcon />
                    </StyledFab>
                    <Typography variant="caption" align="center">
                        {" "}
                        {t("common.sidebar.about")}
                    </Typography>
                </SidebarIconDiv>

                <SidebarIconDiv>
                    <StyledFab id="contact-button" size="small" color={"default"} title={t("common.sidebar.contact")}>
                        <ContactIcon />
                    </StyledFab>
                    <Typography variant="caption" align="center">
                        {" "}
                        {t("common.sidebar.contact")}
                    </Typography>
                </SidebarIconDiv>

                <SidebarIconDiv>
                    <StyledFab
                        id="contact-button"
                        size="small"
                        color={"default"}
                        title={t("common.sidebar.share_data")}
                    >
                        <ShareDataIcon />
                    </StyledFab>
                    <Typography variant="caption" align="center">
                        {" "}
                        {t("common.sidebar.share_data")}
                    </Typography>
                </SidebarIconDiv>

                <SidebarIconDiv>
                    <StyledFab id="language-button" size="small" color={"default"} title={t("common.sidebar.language")}>
                        <LanguageIcon />
                    </StyledFab>
                    <Typography variant="caption" align="center">
                        {" "}
                        {t("common.sidebar.language")}
                    </Typography>
                </SidebarIconDiv>

                <SidebarIconDiv>
                    <StyledFab id="tour-button" size="small" color={"default"} title={t("common.sidebar.take_tour")}>
                        <TakeATourIcon />
                    </StyledFab>
                    <Typography variant="caption" align="center">
                        {" "}
                        {t("common.sidebar.take_tour")}
                    </Typography>
                </SidebarIconDiv>
            </SideBarContainer>
        </Drawer>
    );
};

export default LeftSidebarMenu;
