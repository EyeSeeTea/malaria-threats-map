import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";
import { DialogActions, DialogContent, DialogTitle, IconButton, Theme } from "@mui/material";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import { hasSeenDisplaySuggestion, markDisplaySuggestionAsSeen } from "../utils/browserCache";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            margin: theme.spacing(1),
            width: "100%",
            paddingBlockEnd: "30px",
        },
        dialogActions: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
        },
        dialogTitle: {
            fontWeight: "600",
            fontSize: "20px",
        },
    })
);

const DisplaySuggestionModal = () => {
    const location = useLocation();
    const pageKey = location.pathname;
    const TabletPortraitWidth = 768;
    const [open, setOpen] = useState(false);
    const classes = useStyles({});
    const { t } = useTranslation();

    const handleClose = () => {
        setOpen(false);
        if (!hasSeenDisplaySuggestion(pageKey)) {
            markDisplaySuggestionAsSeen(pageKey);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            const isMobile = window.innerWidth <= TabletPortraitWidth;

            if (isMobile && !hasSeenDisplaySuggestion(pageKey)) {
                setOpen(true);
            }

            if (!isMobile) {
                setOpen(false);
            }
        };

        handleResize();

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <Dialog
            fullWidth={true}
            open={open}
            onClose={handleClose}
            PaperProps={{
                className: classes.paper,
            }}
        >
            <DialogActions className={classes.dialogActions}>
                <DialogTitle className={classes.dialogTitle}>{t("Larger screens are recommended")}</DialogTitle>
                <IconButton onClick={handleClose} size="large">
                    <CloseIcon />
                </IconButton>
            </DialogActions>
            <DialogContent>{t("We recommend using this website using a laptop or desktop computer.")}</DialogContent>
        </Dialog>
    );
};

export default DisplaySuggestionModal;
