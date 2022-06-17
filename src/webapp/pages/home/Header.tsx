import React from "react";
import styled from "styled-components";
import { Button, AppBar, Toolbar, Box, Menu, MenuItem, Divider } from "@mui/material";
import { TFunction, useTranslation, Trans } from "react-i18next";
import IntegrationReactSelect from "../../components/BasicSelect";
import { changeLanguage } from "../../config/i18next";
import i18next from "i18next";
import { useWindowDimensions } from "../../components/hooks/use-window-dimensions";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import { emphasize, Theme } from "@mui/material/styles";

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
        label: "Fre",
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
interface Props {
    width: number;
}

const StyledToolbar = styled(Toolbar)<Props>`
    &.MuiToolbar-root {
        width: ${props => `${props.width * 0.855}px`};
        margin: auto 9% auto auto;
        @media (min-width: 600px) {
            padding: 0;
            min-height: 50px;
        }
        @media (max-width: 1024px) {
            margin-right: 11%;
        }
    }
`;

const StyledButton = styled(Button)`
    &.MuiButton-root {
        padding: 15px 0;
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
        &[aria-expanded=true] {
            font-weight: bold;
        }
    }
    }
`;

const StyledMenuButton = styled(Button)`
    &.MuiButton-root {
        padding: 15px 0;
        color: black;
        font-weight; 400;
        letter-spacing: 0.235px;
        &[aria-expanded=true] {
            font-weight: bold;
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
    @media (min-width: 768px) {
        display: flex;
        flex-wrap: wrap;
    }
`;

const StyledAppBar = styled(AppBar)`
    background-color: white;
`;

const StyledPaddedBox = styled.div`
    padding: 0 40px;
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

interface HeaderProps {
    t: TFunction<"translation", undefined>;
}
const classes = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            pointerEvents: "all",
            flexGrow: 1,
            minWidth: 80,
            padding: 2,
            backgroundColor: "#2FB3AF",
            borderRadius: 5,
        },
        inputPaper: {
            padding: theme.spacing(0.5, 1.5),
        },

        input: {
            cursor: "pointer",
            display: "flex",
            padding: 0,
            height: "auto",
            color: "white",
            "& span": {
                backgroundColor: "transparent",
            },
        },
        valueContainer: {
            display: "flex",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            flexWrap: (props: { isMulti?: boolean }) => (props.isMulti ? "wrap" : "nowrap"),
        },
        chip: {
            margin: theme.spacing(0.5, 0.25),
            overflow: "hidden",
            textOverflow: "ellipsis",
            background: "white",
            borderRadius: "5px",
        },
        chipFocused: {
            backgroundColor: emphasize(
                theme.palette.mode === "light" ? theme.palette.grey[300] : theme.palette.grey[700],
                0.08
            ),
        },
        noOptionsMessage: {
            padding: theme.spacing(1, 2),
        },
        singleValue: {
            fontSize: 14,
            fontWeight: "bold",
        },
        placeholder: {
            position: "absolute",
            left: 2,
            bottom: 6,
            fontSize: 16,
        },
        paper: {
            position: "absolute",
            zIndex: 1,
            marginTop: theme.spacing(1),
            left: 0,
            right: 0,
        },
        divider: {
            height: theme.spacing(2),
        },
    })
);
const Header = ({ t }: HeaderProps) => {
    const { width } = useWindowDimensions();

    const [language, setLanguage] = React.useState(i18next.language || window.localStorage.i18nextLng);
    const [toolAnchorEl, setToolAnchorEl] = React.useState<null | HTMLElement>(null);
    const [storiesAnchorEl, setStoriesAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleChange = (selection: any) => {
        const language = selection.value;
        changeLanguage(language);
        setLanguage(language);
    };

    const handleToolClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (toolAnchorEl !== event.currentTarget) {
            setToolAnchorEl(event.currentTarget);
        }
    };

    const handleStoriesClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (storiesAnchorEl !== event.currentTarget) {
            setStoriesAnchorEl(event.currentTarget);
        }
    };

    useTranslation();

    return (
        <StickyMenu>
            <Box>
                <StyledAppBar position="sticky">
                    <StyledToolbar width={width}>
                        <MenuOptionBox>
                            <StyledPaddedBox>
                                <StyledButton>{t("common.homepage.menu.home")}</StyledButton>
                            </StyledPaddedBox>
                            <StyledPaddedBox>
                                <StyledMenuButton
                                    aria-owns={toolAnchorEl ? "tools-menu" : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={Boolean(toolAnchorEl) === true ? "true" : undefined}
                                    onClick={handleToolClick}
                                    onMouseOver={handleToolClick}
                                >
                                    {t("common.homepage.menu.tools")}
                                </StyledMenuButton>
                            </StyledPaddedBox>
                            <Menu
                                id="tools-menu"
                                anchorEl={toolAnchorEl}
                                open={Boolean(toolAnchorEl)}
                                onClose={() => setToolAnchorEl(null)}
                                variant={"selectedMenu"}
                                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                                transformOrigin={{ vertical: "top", horizontal: "center" }}
                                MenuListProps={{ onMouseLeave: () => setToolAnchorEl(null) }}
                                PaperProps={{ style: StyledMenu }}
                            >
                                <StyledMenuItem onClick={() => setToolAnchorEl(null)}>
                                    {t("common.homepage.tools_submenu.maps")}
                                </StyledMenuItem>
                                <Divider />
                                <StyledMenuItem onClick={() => setToolAnchorEl(null)}>
                                    {t("common.homepage.tools_submenu.dashboards")}
                                </StyledMenuItem>
                                <Divider />
                                <StyledMenuItem onClick={() => setToolAnchorEl(null)}>
                                    {t("common.homepage.tools_submenu.data_download")}
                                </StyledMenuItem>
                            </Menu>
                            <StyledPaddedBox>
                                <StyledMenuButton
                                    aria-owns={storiesAnchorEl ? "stories-menu" : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={Boolean(storiesAnchorEl) === true ? "true" : undefined}
                                    onClick={handleStoriesClick}
                                    onMouseOver={handleStoriesClick}
                                >
                                    {t("common.homepage.menu.stories")}
                                </StyledMenuButton>
                            </StyledPaddedBox>
                            <Menu
                                id="stories-menu"
                                anchorEl={storiesAnchorEl}
                                open={Boolean(storiesAnchorEl)}
                                onClose={() => setStoriesAnchorEl(null)}
                                variant={"selectedMenu"}
                                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                                transformOrigin={{ vertical: "top", horizontal: "center" }}
                                MenuListProps={{ onMouseLeave: () => setStoriesAnchorEl(null) }}
                                PaperProps={{ style: StyledMenu }}
                            >
                                <StyledMenuItem onClick={() => setStoriesAnchorEl(null)}>
                                    {t("common.themes_caps.prevention")}
                                </StyledMenuItem>
                                <Divider />
                                <StyledMenuItem onClick={() => setStoriesAnchorEl(null)}>
                                    {t("common.themes_caps.invasive")}
                                </StyledMenuItem>
                                <Divider />
                                <StyledMenuItem onClick={() => setStoriesAnchorEl(null)} hoverPaddingRight={21}>
                                    {t("common.homepage.stories_submenu.antimalarial_drug_efficacy_and_resistance")}
                                </StyledMenuItem>
                                <Divider />
                                <StyledMenuItem onClick={() => setStoriesAnchorEl(null)}>
                                    <Trans
                                        i18nKey="common.homepage.stories_submenu.parasite_pfhrp_gene_deletions"
                                        t={t}
                                    >
                                        PARASITE <i> pfhrp2/3 </i> GENE DELETIONS
                                    </Trans>
                                </StyledMenuItem>
                            </Menu>
                            <StyledPaddedBox>
                                <StyledButton>{t("common.homepage.menu.about")}</StyledButton>
                            </StyledPaddedBox>
                            <StyledPaddedBox>
                                <StyledButton>{t("common.homepage.menu.contact")}</StyledButton>
                            </StyledPaddedBox>
                            <StyledPaddedBox>
                                <StyledButton>{t("common.homepage.menu.share_data")}</StyledButton>
                            </StyledPaddedBox>
                        </MenuOptionBox>
                        <LanguageSelectorBox>
                            <IntegrationReactSelect
                                id={"language"}
                                suggestions={LANGUAGES}
                                onChange={handleChange}
                                value={LANGUAGES.find(lg => lg.value === language)}
                                classes={classes({ isMulti: false })}
                            />
                        </LanguageSelectorBox>
                    </StyledToolbar>
                </StyledAppBar>
            </Box>
        </StickyMenu>
    );
};

export default Header;
