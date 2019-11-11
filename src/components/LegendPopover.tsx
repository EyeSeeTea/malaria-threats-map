import React from "react";
import Popover from "@material-ui/core/Popover";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Legend from "./Leyend";
import { Fab } from "@material-ui/core";
import ListIcon from "@material-ui/icons/List";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    popover: {
      pointerEvents: "none"
    },
    paper: {
      padding: theme.spacing(1)
    }
  })
);

export default function LegendPopover() {
  const classes = useStyles({});
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handlePopoverOpen = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div>
      <Fab
        size={"small"}
        aria-label="delete"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        <ListIcon />
      </Fab>
      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Legend />
      </Popover>
    </div>
  );
}
