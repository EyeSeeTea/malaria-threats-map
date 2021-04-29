import React from "react";
import Dialog from "@material-ui/core/Dialog";
import CloseIcon from "@material-ui/icons/Close";
import { createStyles, DialogActions, Fab, IconButton, makeStyles, Theme, Typography, DialogContent, Link } from "@material-ui/core";
import { useTranslation, Trans } from "react-i18next";
import { FlexGrow } from "./Chart";
import styled from "styled-components";
import DisclaimerIcon from "@material-ui/icons/Error";
import { sendAnalytics } from "../utils/analytics";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            margin: theme.spacing(2, 0),
            width: "100%",
        },
        fab: {
            pointerEvents: "all",
            margin: theme.spacing(0.5, 0.5),
        },
    })
);

const Wrapper = styled.div`
    margin-top: 16px;
    padding: 0 16px;
`;

const InitialDisclaimer = () => {
    const [open, setOpen] = React.useState(false);
    const classes = useStyles({});
    const { t } = useTranslation(["disclaimer", "common"]);

    const handleClickOpen = () => {
        sendAnalytics({ type: "event", category: "menu", action: "disclaimer" });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Fab
                size="small"
                color={"default"}
                className={classes.fab}
                onClick={handleClickOpen}
                title={t("common:icons.disclaimer")}
            >
                <DisclaimerIcon />
            </Fab>
            <Dialog
                fullWidth
                open={open}
                onClose={handleClose}
                PaperProps={{
                    className: classes.paper,
                }}
            >
                <DialogActions>
                    <Wrapper>
                        <Typography variant="h5">{t("common:icons.disclaimer")}</Typography>
                    </Wrapper>
                    <FlexGrow />
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogActions>
                <DialogContent
            style={{
                textAlign: "justify",
                textJustify: "inter-word",
            }}
        >
            <Typography variant={"body2"}>
            <Trans i18nKey="disclaimer:p1a" t={t}>
                <strong>Data source:</strong> Global Malaria Programme
            </Trans>
            </Typography>
            <Typography variant={"body2"} gutterBottom>
            <Trans i18nKey="disclaimer:p1b" t={t}>
                <strong>Map production:</strong> Global Malaria Programme. World Health Organization.
            </Trans>
                <Link href={t("disclaimer:p1bLink")} target="_blank" rel="noopener noreferrer">
                    {t("disclaimer:p1bLinkText")}
                </Link>
                {t("disclaimer:p1c")}
            </Typography>
            <br />
            <Typography variant={"body2"} gutterBottom>
                {t("disclaimer:p2")}
            </Typography>
            <Typography variant={"body2"} gutterBottom>
                {t("disclaimer:p3a")}
                <Link
                    href={t("disclaimer:p3aLink")}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                {t("disclaimer:p3b")}
                </Link>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                {t("disclaimer:p4a")}
            </Typography>
            <Typography variant={"caption"} gutterBottom>
            {t("disclaimer:p4b")}
            <Link
                    href={t("disclaimer:p4bLink")}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {t("disclaimer:p4bLinkText")}
                </Link>
            </Typography>
            <br />
            <br />
            <Typography variant={"body2"}>
                {t("disclaimer:p5a")}
                <Link href={t("disclaimer:p5aLink")} target="_blank" rel="noopener noreferrer">
                {t("disclaimer:p5aLinkText")}
                </Link>
            </Typography>
        </DialogContent>
                <DialogActions />
            </Dialog>
        </div>
    );
};

export default InitialDisclaimer;
