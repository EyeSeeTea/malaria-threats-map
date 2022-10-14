import React from "react";
import { State } from "../store/types";
import { connect } from "react-redux";
import { Fab, Theme } from "@mui/material";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import { selectStoryMode } from "../store/reducers/base-reducer";
import { setStoryModeAction } from "../store/actions/base-actions";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import { dispatchCustomEvent } from "../utils/dom-utils";
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

function StoryModeSelector({ storyMode, setStoryMode }: any) {
    const { t } = useTranslation();
    const classes = useStyles({});
    const handleToggle = () => {
        const newStoryModel = !storyMode;
        if (newStoryModel) sendAnalytics({ type: "event", category: "menu", action: "storymode" });
        setStoryMode(newStoryModel);
    };
    dispatchCustomEvent("resize");
    return (
        <div>
            <Fab
                size="small"
                color={storyMode ? "primary" : "default"}
                onClick={handleToggle}
                className={classes.fab}
                title={t("common.icons.story")}
            >
                <ImportContactsIcon />
            </Fab>
        </div>
    );
}

const mapStateToProps = (state: State) => ({
    storyMode: selectStoryMode(state),
});

const mapDispatchToProps = {
    setStoryMode: setStoryModeAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(StoryModeSelector);
