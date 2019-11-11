import React from "react";
import clsx from "clsx";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import Map from "./Map";
import Disclaimer from "./Disclaimer";
import styled from "styled-components";
import { connect } from "react-redux";
import { State } from "../store/types";
import {
  selectAreFiltersOpen,
  selectFilters,
  selectStoryMode,
  selectTheme
} from "../store/reducers/base-reducer";
import {
  setFiltersOpen,
  setStoryModeAction
} from "../store/actions/base-actions";
import { selectPreventionFilters } from "../store/reducers/prevention-reducer";
import { selectDiagnosisFilters } from "../store/reducers/diagnosis-reducer";
import { selectTreatmentFilters } from "../store/reducers/treatment-reducer";
import { selectInvasiveFilters } from "../store/reducers/invasive-reducer";
import { setPreventionMapType } from "../store/actions/prevention-actions";
import { Hidden } from "@material-ui/core";
import StoryModeStepper from "./StoryModeStepper";
import FiltersSidebar from "./FiltersSidebar";

interface ThemeProps {
  drawerWidth: number;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      position: "absolute",
      top: 0,
      right: 0,
      left: 0,
      bottom: 0
    },
    appBar: {
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
    },
    appBarShift: {
      width: (props: ThemeProps) => `calc(100% - ${props.drawerWidth}px)`,
      marginLeft: (props: ThemeProps) => props.drawerWidth,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      })
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
    hide: {
      display: "none"
    },
    drawer: {
      width: (props: ThemeProps) => props.drawerWidth,
      flexShrink: 0
    },
    drawerPaper: {
      width: (props: ThemeProps) => props.drawerWidth,
      backgroundColor: "#f3f3f3"
    },
    drawerHeader: {
      display: "flex",
      alignItems: "center",
      padding: theme.spacing(0, 1),
      ...theme.mixins.toolbar,
      justifyContent: "flex-end"
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      marginLeft: `-${(props: ThemeProps) => props.drawerWidth}`
    },
    contentShift: {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      }),
      marginLeft: 0,
      position: "relative"
    },
    tab: {
      minWidth: 0
    }
  })
);

const PageWrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const MapWrapper = styled.div`
  position: absolute;
  flex: 1;
  position: relative;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const mapStateToProps = (state: State) => ({
  filtersOpen: selectAreFiltersOpen(state),
  filters: selectFilters(state),
  theme: selectTheme(state),
  storyMode: selectStoryMode(state),
  preventionFilters: selectPreventionFilters(state),
  diagnosisFilters: selectDiagnosisFilters(state),
  treatmentFilters: selectTreatmentFilters(state),
  invasiveFilters: selectInvasiveFilters(state)
});
const mapDispatchToProps = {
  setPreventionMapType: setPreventionMapType,
  setFiltersOpen: setFiltersOpen,
  setStoryMode: setStoryModeAction
};
type OwnProps = {
  drawerWidth?: number;
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps & OwnProps;

function PersistentDrawerLeft({
  storyMode,
  filtersOpen,
  drawerWidth = 400
}: Props) {
  const classes = useStyles({ drawerWidth });

  const isOpen = filtersOpen || storyMode;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={isOpen}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        {storyMode ? (
          <>
            <StoryModeStepper />
          </>
        ) : (
          <>
            <FiltersSidebar />
          </>
        )}
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: isOpen
        })}
      >
        <div className={classes.drawerHeader} />
        <PageWrapper>
          <MapWrapper>
            <Map />
          </MapWrapper>
          <Hidden xsDown>
            <Disclaimer />
          </Hidden>
        </PageWrapper>
      </main>
    </div>
  );
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PersistentDrawerLeft);
