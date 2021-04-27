import React from "react";
import Dialog from "@material-ui/core/Dialog";
import CloseIcon from "@material-ui/icons/Close";
import { createStyles, DialogActions, Fab, IconButton, makeStyles, Theme, Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { FlexGrow } from "./Chart";
import styled from "styled-components";
import DisclaimerIcon from "@material-ui/icons/Error";
import EnglishDisclaimer from "./disclaimers/EnglishDisclaimer";
import i18next from "i18next";
import SpanishDisclaimer from "./disclaimers/SpanishDisclaimer";
import FrenchDisclaimer from "./disclaimers/FrenchDisclaimer";
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
    const { t } = useTranslation("common");

    const handleClickOpen = () => {
        sendAnalytics({ type: "event", category: "menu", action: "disclaimer" });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const getDisclaimer = () => {
        const language = i18next.language || window.localStorage.i18nextLng;
        switch (language) {
            case "fr":
                return <FrenchDisclaimer />;
            case "es":
                return <SpanishDisclaimer />;
            default:
                return <EnglishDisclaimer />;
        }
    };

    return (
        <div>
            <Fab
                size="small"
                color={"default"}
                className={classes.fab}
                onClick={handleClickOpen}
                title={t("icons.disclaimer")}
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
                        <Typography variant="h5">{t("icons.disclaimer")}</Typography>
                    </Wrapper>
                    <FlexGrow />
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogActions>
                {getDisclaimer()}
                <DialogActions />
            </Dialog>
        </div>
    );
};

export default InitialDisclaimer;
