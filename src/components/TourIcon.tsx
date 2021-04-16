import React from "react";
import { createStyles, Fab, makeStyles, Theme } from "@material-ui/core";
import WizardIcon from "@material-ui/icons/Explore";
import { useTranslation } from "react-i18next";
import { sendAnalytics } from "../utils/analytics";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginTop: theme.spacing(1),
            "& > *": {
                margin: theme.spacing(1),
                width: "25ch",
            },
        },
        fab: {
            pointerEvents: "all",
            margin: theme.spacing(0.5, 0.5),
        },
        paper: {
            margin: theme.spacing(1),
            padding: theme.spacing(3),
            width: "100%",
        },
    })
);

const TourIcon = () => {
    const classes = useStyles({});
    const { t } = useTranslation("common");

    return (
        <React.Fragment>
            <Fab
                id="country-button"
                size="small"
                color={"default"}
                className={classes.fab}
                onClick={() => {
                    sendAnalytics({ type: "event", category: "menu", action: "tour" });
                    localStorage.setItem("tour", "");
                    window.history.pushState({}, document.title, window.location.href.split("?")[0]);
                    window.location.reload();
                }}
                title={t("icons.tour")}
            >
                <WizardIcon />
            </Fab>
        </React.Fragment>
    );
};

export default TourIcon;
