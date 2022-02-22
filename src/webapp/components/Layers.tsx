import React from "react";
import LayersIcon from "@mui/icons-material/Layers";
import { State } from "../store/types";
import { connect } from "react-redux";
import { Fab, Theme } from "@mui/material";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import { selectEndemicity } from "../store/reducers/base-reducer";
import { setFiltersAction, toggleEndemicityLayerAction } from "../store/actions/base-actions";
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

function Layers({ toogleEndemicityLayer, endemicityLayer }: any) {
    const classes = useStyles({});
    const { t } = useTranslation();
    const handleToggle = () => {
        const newValue = !endemicityLayer;
        if (newValue) sendAnalytics({ type: "event", category: "menu", action: "shade" });
        toogleEndemicityLayer(newValue);
    };
    return (
        <div>
            <Fab
                size="small"
                color={endemicityLayer ? "primary" : "default"}
                onClick={handleToggle}
                className={classes.fab}
                title={t("common.icons.endemicity")}
            >
                <LayersIcon />
            </Fab>
        </div>
    );
}

const mapStateToProps = (state: State) => ({
    endemicityLayer: selectEndemicity(state),
});

const mapDispatchToProps = {
    toogleEndemicityLayer: toggleEndemicityLayerAction,
    setFilters: setFiltersAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Layers);
