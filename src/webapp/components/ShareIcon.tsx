import React from "react";
import { createStyles, Fab, makeStyles, Theme } from "@material-ui/core";
import Share from "@material-ui/icons/Share";
import { useTranslation } from "react-i18next";
import { addNotificationAction } from "../store/actions/notifier-actions";
import { connect } from "react-redux";
import CopyToClipboard from "react-copy-to-clipboard";
import { logEventAction } from "../store/actions/base-actions";

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
            margin: theme.spacing(0.5, 0),
        },
        paper: {
            margin: theme.spacing(1),
            padding: theme.spacing(3),
            width: "100%",
        },
    })
);

const mapDispatchToProps = {
    addNotification: addNotificationAction,
    logEventAction: logEventAction,
};

type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps;

const nav = window.navigator as any;

const ShareIcon = ({ addNotification, logEventAction }: Props) => {
    const classes = useStyles({});
    const { t } = useTranslation("common");

    return (
        <React.Fragment>
            {nav.share ? (
                <Fab
                    id="share-button"
                    size="small"
                    color={"default"}
                    className={classes.fab}
                    onClick={() => {
                        logEventAction({ category: "menu", action: "share" });
                        nav.share({
                            title: "Malaria Threats Map",
                            text: "Explore Malaria Threats Map",
                            url: window.location.href,
                        })
                            .then(() => console.log("Share complete"))
                            .error(() => console.error("Could not share at this time"));
                    }}
                    title={t("icons.share")}
                >
                    <Share />
                </Fab>
            ) : (
                <CopyToClipboard
                    text={window.location.href}
                    onCopy={() => {
                        logEventAction({ category: "menu", action: "share" });
                        addNotification("Copied to the clipboard");
                    }}
                >
                    <Fab
                        id="share-button"
                        size="small"
                        color={"default"}
                        className={classes.fab}
                        title={t("icons.share")}
                    >
                        <Share />
                    </Fab>
                </CopyToClipboard>
            )}
        </React.Fragment>
    );
};

export default connect(null, mapDispatchToProps)(ShareIcon);
