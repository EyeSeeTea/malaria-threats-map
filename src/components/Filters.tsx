import React from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import Slide from "@material-ui/core/Slide";
import {TransitionProps} from "@material-ui/core/transitions";
import FilterIcon from "@material-ui/icons/FilterList";
import InsecticideClassFilter from "./filters/InsecticideClassFilter";
import {AppBar, Button, Fab, Toolbar, Typography} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import YearRangeSelector from "./YearRangeSelector";
import styled from "styled-components";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      backgroundColor: "#404041",
      position: "relative"
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1
    },
    fab: {
      margin: theme.spacing(0.5, 0)
    },
    extendedIcon: {
      marginRight: theme.spacing(1)
    }
  })
);

const FilterButton = styled(IconButton)`
  background-color: white;
`;

const Transition = React.forwardRef<unknown, TransitionProps>(
  function Transition(props: any, ref: any) {
    return <Slide direction="right" ref={ref} {...props} />;
  }
);

export default function Filters() {
  const classes = useStyles({});
  const [open, setOpen] = React.useState(false);

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  return (
    <div>
      <Fab
        variant="extended"
        color="default"
        onClick={handleClickOpen}
        className={classes.fab}
      >
        <FilterIcon className={classes.extendedIcon} />
        Filters
      </Fab>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        style={{
          position: "absolute",
          left: 0,
          maxWidth: "400px"
        }}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}></Typography>
            <Button color="inherit" onClick={handleClose}>
              Reset
            </Button>
          </Toolbar>
        </AppBar>
        <InsecticideClassFilter />
        <YearRangeSelector />
      </Dialog>
    </div>
  );
}
