import React from "react";
import { createStyles, Fab, makeStyles, Theme } from "@material-ui/core";
import Share from "@material-ui/icons/Share";
import { useTranslation } from "react-i18next";

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

const nav = window.navigator as any;

const ShareIcon = () => {
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
          if (nav.share) {
            nav
              .share({
                title: "Malaria Threats Map",
                text: "Explore Malaria Threats Map",
                url: window.location.href,
              })
              .then(() => console.log("Share complete"))
              .error(() => console.error("Could not share at this time"));
          } else {
              alert("Option not available on your phone")
          }
        }}
        title={t("icons.tour")}
      >
        <Share />
      </Fab>
    </React.Fragment>
  );
};

export default ShareIcon;
