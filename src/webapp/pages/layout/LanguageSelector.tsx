import React from "react";
import styled from "styled-components";
import IntegrationReactSelect from "../../components/BasicSelect";
import { changeLanguage } from "../../config/i18next";
import i18next from "i18next";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import { emphasize, Theme } from "@mui/material/styles";
import { Box } from "@mui/material";

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

const LanguageSelectorBox = styled(Box)`
    width: 100px;
    padding: 15px;
`;

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
const LanguageSelector: React.FC = () => {
    const [language, setLanguage] = React.useState(i18next.language || window.localStorage.i18nextLng);
    function handleChange(selection: any) {
        const language = selection.value;
        changeLanguage(language);
        setLanguage(language);
    }

    return (
        <LanguageSelectorBox>
            <IntegrationReactSelect
                id={"language"}
                suggestions={LANGUAGES}
                onChange={handleChange}
                value={LANGUAGES.find(lg => lg.value === language)}
                classes={classes({ isMulti: false })}
            />
        </LanguageSelectorBox>
    );
};

export default LanguageSelector;
