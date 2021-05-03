import React from "react";
import { State } from "../store/types";
import { connect } from "react-redux";
import { createStyles, Fab, makeStyles, Theme } from "@material-ui/core";
import { selectCountryMode } from "../store/reducers/base-reducer";
import { setCountryModeAction } from "../store/actions/base-actions";
import { GlobeIcon } from "./Icons";
import { useTranslation } from "react-i18next";
import { sendAnalytics } from "../utils/analytics";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        fab: {
            pointerEvents: "all",
            margin: theme.spacing(0.5, 0),
        },
    })
);

function Layers({ countryMode, setCountryMode, disabled }: any) {
    const classes = useStyles({});
    const { t } = useTranslation("common");
    const handleToggle = () => {
        const newCountryMode = !countryMode;
        const label = newCountryMode ? "country" : "site";
        sendAnalytics({ type: "event", category: "menu", action: "country/site", label });
        setCountryMode(newCountryMode);
    };
    return (
        <div>
            <Fab
                id="country-button"
                size="small"
                color={countryMode ? "primary" : "default"}
                onClick={handleToggle}
                className={classes.fab}
                disabled={disabled}
                aria-label={"Show studies per country"}
                title={t("icons.visualization")}
            >
                <GlobeIcon />
            </Fab>
        </div>
    );
}

const mapStateToProps = (state: State) => ({
    countryMode: selectCountryMode(state),
});

const mapDispatchToProps = {
    setCountryMode: setCountryModeAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Layers);
