import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import Slide from "@material-ui/core/Slide";
import { TransitionProps } from "@material-ui/core/transitions";
import FilterIcon from "@material-ui/icons/FilterList";
import InsecticideClassFilter from "./filters/InsecticideClassFilter";
import { AppBar, Fab, Toolbar, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import YearRangeSelector from "./YearRangeSelector";
import styled from "styled-components";
import InsecticideTypeFilter from "./filters/InsecticideTypeFilter";
import FormLabel from "@material-ui/core/FormLabel";
import TypeFilter from "./filters/TypeFilter";
import SpeciesFilter from "./filters/SpeciesFilter";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      backgroundColor: "#008dc9",
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
      marginRight: theme.spacing(0.5)
    },
    paper: {
      backgroundColor: "#f3f3f3"
    }
  })
);

const FilterWrapper = styled.div`
  margin: 10px 20px;
`;
const Divider = styled.div`
  height: 10px;
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
        size="small"
        color="primary"
        onClick={handleClickOpen}
        className={classes.fab}
      >
        <FilterIcon className={classes.extendedIcon} fontSize="small" />
        Filters
      </Fab>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        BackdropProps={{
          style: {
            backgroundColor: "transparent"
          }
        }}
        PaperProps={{
          className: classes.paper
        }}
        style={{
          position: "absolute",
          left: 0,
          maxWidth: "400px"
        }}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <FilterIcon />
            <Typography variant="h6" className={classes.title}>
              {" "}
              Filters
            </Typography>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <FilterWrapper>
          <FormLabel component="legend">Insecticide Class</FormLabel>
          <Divider />
          <InsecticideClassFilter />
        </FilterWrapper>
        <FilterWrapper>
          <FormLabel component="legend">Insecticide Type</FormLabel>
          <Divider />
          <InsecticideTypeFilter />
        </FilterWrapper>
        <FilterWrapper>
          <FormLabel component="legend">Type</FormLabel>
          <Divider />
          <TypeFilter />
        </FilterWrapper>
        <FilterWrapper>
          <FormLabel component="legend">Vector Species</FormLabel>
          <Divider />
          <SpeciesFilter />
        </FilterWrapper>
        <YearRangeSelector />
      </Dialog>
    </div>
  );
}
