import { Button, Divider, Menu, MenuItem } from "@mui/material";
import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { useTranslation, Trans } from "react-i18next";

interface DirectionProps {
    flexDirection: "column" | "row";
}

const MenuItemContainer = styled.div<DirectionProps>`
    margin-right: ${({ flexDirection }) => (flexDirection === "row" ? "80px" : "0px")};
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
      &[aria-expanded=true] {
        font-weight: bold;
    }
}`;

const StyledMenuButton = styled(Button)`
    &.MuiButton-root {
    width: 100%;
    padding: 15px 0;
    color: black;
    font-weight; 400;
    letter-spacing: 0.235px;
    &[aria-expanded=true] {
        font-weight: bold;
    }
`;

const StyledMenu = {
    marginTop: 8,
    boxShadow: "0px 3px 26px #00000029",
    borderRadius: "10px",
    opacity: 1,
};

interface StyledMenuItemProps {
    hoverPaddingRight?: number;
}

const StyledMenuItem = styled(MenuItem).withConfig({
    shouldForwardProp: prop => !["hoverPaddingRight"].includes(prop),
})<StyledMenuItemProps>`
    &.MuiMenuItem-root {
        font-weight: 400;
        text-align: left;
        text-transform: none;
        font: normal normal medium 14px/25px "Roboto";
        font-size: 14px;
        letter-spacing: 0.45px;
        color: #343434;
        opacity: 1;
        background-color: white;
    }
    &.eVCSsi {
        padding-left: 29px;
        padding-right: 29px;
        background-color: white;
        &:hover {
            font-weight: bold;
            background-color: white;
            padding-right: ${props => (props.hoverPaddingRight ? props.hoverPaddingRight : 26)}px;
        }
    }
`;

export interface SimpleMenu {
    kind: "simple-menu";
    name: string;
    path: string;
}

export interface SimpleMenuTrans {
    kind: "simple-menu-trans";
    name: string;
    path: string;
}

export interface ParentMenu {
    kind: "parent-menu";
    name: string;
    submenus?: MenuData[];
}

export type MenuData = SimpleMenu | ParentMenu | SimpleMenuTrans;

interface SimpleMenuProps extends DirectionProps {
    menu: MenuData;
    t?: any;
}

const NavMenu: React.FC<SimpleMenuProps> = ({ menu, flexDirection, t }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (anchorEl !== event.currentTarget) {
            setAnchorEl(event.currentTarget);
        }
    };

    switch (menu.kind) {
        case "simple-menu":
            return (
                <MenuItemContainer flexDirection={flexDirection}>
                    <Button component={StyledLink} to={menu.path}>
                        {menu.name}
                    </Button>
                </MenuItemContainer>
            );
        case "simple-menu-trans":
            return (
                <MenuItemContainer flexDirection={flexDirection}>
                    <Trans i18nKey={"homepage.stories_submenu.parasite_pfhrp_gene_deletions"} t={t}>Parasite <i>pfhrp2/3</i> gene deletions</Trans>
                                        </MenuItemContainer>
            );
        case "parent-menu":
            return (
                <>
                    <MenuItemContainer flexDirection={flexDirection}>
                        <StyledMenuButton
                            aria-owns={anchorEl ? menu.name : undefined}
                            aria-haspopup="true"
                            aria-expanded={Boolean(anchorEl) === true ? "true" : undefined}
                            onClick={handleClick}
                            onMouseOver={handleClick}
                        >
                            {menu.name}
                        </StyledMenuButton>
                    </MenuItemContainer>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => setAnchorEl(null)}
                        variant={"selectedMenu"}
                        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                        transformOrigin={{ vertical: "top", horizontal: "center" }}
                        MenuListProps={{ onMouseLeave: () => setAnchorEl(null) }}
                        PaperProps={{ style: StyledMenu }}
                    >
                        {menu.submenus &&
                            menu.submenus.map((submenu, index) => {
                                return (
                                    <>
                                        <StyledMenuItem key={index} onClick={() => setAnchorEl(null)}>
                                            {submenu.name}
                                        </StyledMenuItem>
                                        {index < menu.submenus.length - 1 ? <Divider /> : null}
                                    </>
                                );
                            })}
                    </Menu>
                </>
            );
    }
};

export default NavMenu;
