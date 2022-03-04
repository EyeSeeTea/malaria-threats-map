import React from "react";
import TheaterIcon from "@mui/icons-material/PlayCircleFilled";
import { connect } from "react-redux";
import { Fab, Theme } from "@mui/material";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import { setTheaterModeAction } from "../../store/actions/base-actions";
import { State } from "../../store/types";
import { selectTheaterMode } from "../../store/reducers/base-reducer";
import { useTranslation } from "react-i18next";
import { sendAnalytics } from "../../utils/analytics";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        fab: {
            pointerEvents: "all",
            margin: theme.spacing(0.5, 0),
        },
    })
);

const mapStateToProps = (state: State) => ({
    theaterMode: selectTheaterMode(state),
});

const mapDispatchToProps = {
    setTheaterMode: setTheaterModeAction,
};

function TheaterModeIcon({ theaterMode, setTheaterMode }: any) {
    const classes = useStyles({});
    const { t } = useTranslation();

    function setTheaterModeAndLog(value: boolean) {
        setTheaterMode(value);
        if (value) sendAnalytics({ type: "event", category: "menu", action: "animation" });
    }

    return (
        <div>
            <Fab
                size="small"
                color={theaterMode ? "primary" : "default"}
                onClick={() => setTheaterModeAndLog(!theaterMode)}
                className={classes.fab}
                title={t("common.icons.animation")}
            >
                <TheaterIcon />
            </Fab>
        </div>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(TheaterModeIcon);
