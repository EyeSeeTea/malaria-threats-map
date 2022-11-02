import React from "react";
import { Dialog, DialogTitle, ListItemText, ListItem, List, ListItemButton } from "@mui/material";
import { useTranslation } from "react-i18next";

export const LANGUAGES = [
    {
        value: "en",
        label: "English",
        code: "en",
    },
    {
        value: "es",
        label: "Español",
        code: "es",
    },
    {
        value: "fr",
        label: "Français",
        code: "fr",
    },
];
export interface SimpleDialogProps {
    open: boolean;
    selectedValue: string;
    onClose: (value: string) => void;
}

export const LanguageSelectorDialog = (props: SimpleDialogProps) => {
    const { onClose, selectedValue, open } = props;
    const { t } = useTranslation();

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleListItemClick = (value: string) => {
        onClose(value);
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>{t("common.options.select_language")}</DialogTitle>
            <List sx={{ pt: 0, margin: "auto" }}>
                {LANGUAGES.map(language => (
                    <ListItemButton
                        selected={language.code === selectedValue}
                        onClick={() => handleListItemClick(language.value)}
                        key={language.value}
                    >
                        <ListItemText primary={language.label} />
                    </ListItemButton>
                ))}
            </List>
        </Dialog>
    );
};
