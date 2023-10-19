import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";
import { DialogActions, DialogContent, DialogTitle, IconButton, Theme } from "@mui/material";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import { hasShowedDisplaySuggestion, markDisplaySuggestionAsShowed } from "../utils/localStorage-utils";
import { useTranslation } from "react-i18next";

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
    const TabletPortraitWidth = 768;
    const [open, setOpen] = useState(false);
    const classes = useStyles({});
    const { t } = useTranslation();

    useEffect(() => {
        const handleResize = () => {
            const isMobile = window.innerWidth <= TabletPortraitWidth;

            if (isMobile && !hasShowedDisplaySuggestion()) {
                setOpen(true);
                markDisplaySuggestionAsShowed();
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
            onClose={() => setOpen(false)}
            PaperProps={{
                className: classes.paper,
            }}
        >
            <DialogActions className={classes.dialogActions}>
                <DialogTitle className={classes.dialogTitle}>{t("Larger screens are recommended")}</DialogTitle>
                <IconButton onClick={() => setOpen(false)} size="large">
                    <CloseIcon />
                </IconButton>
            </DialogActions>
            <DialogContent>{t("We recommend using this website using a laptop or desktop computer.")}</DialogContent>
        </Dialog>
    );
};

export default DisplaySuggestionModal;
