import React from "react";
import styled from "styled-components";
import { Button, AppBar, Toolbar, Box } from "@mui/material";
import { TFunction } from "react-i18next";
import { NavLink, NavLinkProps } from "react-router-dom";
import IntegrationReactSelect from "../components/BasicSelect";
import { changeLanguage } from "../config/i18next";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { useWindowDimensions } from "../components/hooks/use-window-dimensions";
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

const StyledLink = styled(NavLink)<NavLinkProps>`
    text-decoration: none;
    padding: 15px 0;
    color: black;
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
                    <StyledToolbar width={width}>
                        <MenuOptionBox>
                            <StyledPaddedBox>
                                <Button component={StyledLink} to="/">
                                    {t("common.homepage.menu.home")}
                                </Button>
                            </StyledPaddedBox>
                            <StyledPaddedBox>
                                <StyledButton>{t("common.homepage.menu.tools")}</StyledButton>
                            </StyledPaddedBox>
                            <StyledPaddedBox>
                                <Button component={StyledLink} to="/about">
                                    {t("common.homepage.menu.about")}
                                </Button>
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
