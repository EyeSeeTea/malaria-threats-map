import React from "react";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { changeLanguage, lng } from "../config/i18next";

const LANGUAGES = [
    {
        value: "english",
        label: "English",
        code: "en",
    },
    {
        value: "spanish",
        label: "Español",
        code: "es",
    },
    {
        value: "french",
        label: "Français",
        code: "fr",
    },
];

export default function LanguageSelector() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [language, setLanguage] = React.useState(LANGUAGES.find(language => language.code === (lng || "en")));

    function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
        setAnchorEl(event.currentTarget);
    }

    function handleClose(value: string) {
        const selection = LANGUAGES.find(language => language.value === value);
        if (!selection) {
            console.error("Not selected a valid language");
            return;
        }
        setLanguage(selection);
        changeLanguage(selection.code);
        setAnchorEl(null);
    }

    return language ? (
        <div>
            <Button
                variant="contained"
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleClick}
                style={{ textTransform: "none" }}
            >
                {language.label}
            </Button>
            <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={!!anchorEl} onClose={handleClose}>
                {LANGUAGES.map(language => (
                    <MenuItem key={language.value} onClick={() => handleClose(language.value)}>
                        {language.label}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    ) : (
        <div />
    );
}
