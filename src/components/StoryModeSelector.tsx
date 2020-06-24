import React from "react";
import { State } from "../store/types";
import { connect } from "react-redux";
import { createStyles, Fab, makeStyles, Theme } from "@material-ui/core";
import { selectStoryMode } from "../store/reducers/base-reducer";
import { setStoryModeAction } from "../store/actions/base-actions";
import ImportContactsIcon from "@material-ui/icons/ImportContacts";
import { dispatchCustomEvent } from "../utils/dom-utils";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      pointerEvents: "all",
      margin: theme.spacing(0.5, 0),
    },
  })
);

function StoryModeSelector({ storyMode, setStoryMode }: any) {
  const { t } = useTranslation("common");
  const classes = useStyles({});
  const handleToggle = () => {
    setStoryMode(!storyMode);
  };
  dispatchCustomEvent("resize");
  return (
    <div>
      <Fab
        size="small"
        color={storyMode ? "primary" : "default"}
        onClick={handleToggle}
        className={classes.fab}
        title={t("buttons.select_story_mode")}
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
