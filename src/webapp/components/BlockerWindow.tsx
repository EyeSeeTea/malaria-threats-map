import React from "react";
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";
import { DialogActions, DialogContent, DialogTitle, IconButton, Theme } from "@mui/material";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
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

const BlockerWindow = () => {
    const [open, setOpen] = React.useState(false);
    const classes = useStyles({});
    const { t } = useTranslation();

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

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
                <DialogTitle className={classes.dialogTitle}>{t("Action not available")}</DialogTitle>
                <IconButton onClick={handleClose} size="large">
                    <CloseIcon />
                </IconButton>
            </DialogActions>
            <DialogContent>
                {t("This view or action is not available on your device. Please try again on a laptop or desktop.")}
            </DialogContent>
        </Dialog>
    );
};

export default BlockerWindow;
