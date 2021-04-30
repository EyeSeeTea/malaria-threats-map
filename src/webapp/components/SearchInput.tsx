import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import DirectionsIcon from "@material-ui/icons/Directions";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles({
  root: {
    padding: "2px 4px",
    marginBottom: "8px",
    display: "flex",
    alignItems: "center",
    minWidth: 325,
    maxWidth: 400
  },
  iconButton: {
    padding: 10
  },
  input: {
    flex: 1
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4
  }
});

export default function SearchInput() {
  // @ts-ignore
  const classes = useStyles();
  const { t } = useTranslation("common");

  return (
    <Paper className={classes.root}>
      <IconButton className={classes.iconButton} aria-label="menu">
        <MenuIcon />
      </IconButton>
      <InputBase
        value={t("AFRICA_SOUTH-EAST_SUB-REGION")}
        placeholder="Search Google Maps"
        inputProps={{ "aria-label": "search google maps" }}
        className={classes.input}
      />
      <IconButton
        color="default"
        className={classes.iconButton}
        aria-label="directions"
      >
        <DirectionsIcon />
      </IconButton>
    </Paper>
  );
}
