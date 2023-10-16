import React from "react";
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";
import { DialogActions, DialogContent, DialogTitle, IconButton, Theme } from "@mui/material";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import { useTranslation } from "react-i18next";

type DisplaySuggestionModalType = {
    open: boolean;
    handleClose: () => void;
};

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

const DisplaySuggestionModal = ({ open, handleClose }: DisplaySuggestionModalType) => {
    const classes = useStyles({});
    const { t } = useTranslation();

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
            <DialogContent>
                {t(
                    "While this site is designed to be accessible, you might find it more accurate on larger screens. If possible, please interact with this website using a laptop or desktop computer."
                )}
            </DialogContent>
        </Dialog>
    );
};

export default DisplaySuggestionModal;
