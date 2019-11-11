import React from "react";
import clsx from "clsx";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import Map from "./Map";
import Disclaimer from "./Disclaimer";
import styled from "styled-components";
import { connect } from "react-redux";
import {
  DiagnosisMapType,
  InvasiveMapType,
  PreventionMapType,
  State,
  TreatmentMapType
} from "../store/types";
import {
  selectAreFiltersOpen,
  selectFilters,
  selectTheme
} from "../store/reducers/base-reducer";
import { setFiltersOpen } from "../store/actions/base-actions";
import { selectPreventionFilters } from "../store/reducers/prevention-reducer";
import { selectDiagnosisFilters } from "../store/reducers/diagnosis-reducer";
import { selectTreatmentFilters } from "../store/reducers/treatment-reducer";
import { selectInvasiveFilters } from "../store/reducers/invasive-reducer";
import { setPreventionMapType } from "../store/actions/prevention-actions";
import ResistanceStatusFilters, {
  Divider,
  FilterWrapper
} from "./layers/prevention/ResistanceStatus/ResistanceStatusFilters";
import IntensityStatusFilters from "./layers/prevention/IntensityStatus/IntensityStatusFilters";
import ResistanceMechanismFilters from "./layers/prevention/ResistanceMechanisms/ResistanceMechanismFilters";
import LevelOfInvolvementFilters from "./layers/prevention/Involvement/LevelOfInvolvementFilters";
import PboDeploymentFilters from "./layers/prevention/PboDeployment/PboDeploymentFilters";
import GeneDeletionFilters from "./layers/diagnosis/GeneDeletions/GeneDeletionFilters";
import TreatmentFailureFilters from "./layers/treatment/TreatmentFailure/TreatmentFailureFilters";
import DelayedParasiteClearanceFilters from "./layers/treatment/DelayedParasiteClearance/DelayedParasiteClearanceFilters";
import MolecularMarkerFilters from "./layers/treatment/MolecularMarkers/MolecularMarkerFilters";
import VectorOccuranceFilters from "./layers/invasive/VectorOccurance/VectorOccuranceFilters";
import AppBar from "@material-ui/core/AppBar/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import FilterIcon from "@material-ui/icons/FilterList";
import { GlobeIcon } from "./Icons";
import CountrySelector from "./CountrySelector";
import FormLabel from "@material-ui/core/FormLabel";
import { Hidden } from "@material-ui/core";

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

const FiltersWrapper = styled.div`
  margin-top: 10px;
`;

const mapStateToProps = (state: State) => ({
  filtersOpen: selectAreFiltersOpen(state),
  filters: selectFilters(state),
  theme: selectTheme(state),
  preventionFilters: selectPreventionFilters(state),
  diagnosisFilters: selectDiagnosisFilters(state),
  treatmentFilters: selectTreatmentFilters(state),
  invasiveFilters: selectInvasiveFilters(state)
});
const mapDispatchToProps = {
  setPreventionMapType: setPreventionMapType,
  setFiltersOpen: setFiltersOpen
};
type OwnProps = {
  drawerWidth?: number;
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps & OwnProps;

function PersistentDrawerLeft({
  theme,
  filtersOpen,
  preventionFilters,
  diagnosisFilters,
  treatmentFilters,
  invasiveFilters,
  drawerWidth = 400
}: Props) {
  const classes = useStyles({ drawerWidth });
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  function resolveFilters() {
    switch (theme) {
      case "prevention":
        switch (preventionFilters.mapType) {
          case PreventionMapType.RESISTANCE_STATUS:
            return <ResistanceStatusFilters />;
          case PreventionMapType.INTENSITY_STATUS:
            return <IntensityStatusFilters />;
          case PreventionMapType.RESISTANCE_MECHANISM:
            return <ResistanceMechanismFilters />;
          case PreventionMapType.LEVEL_OF_INVOLVEMENT:
            return <LevelOfInvolvementFilters />;
          case PreventionMapType.PBO_DEPLOYMENT:
            return <PboDeploymentFilters />;
          default:
            return <div />;
        }
      case "diagnosis":
        switch (diagnosisFilters.mapType) {
          case DiagnosisMapType.GENE_DELETIONS:
            return <GeneDeletionFilters />;
          default:
            return <div />;
        }
      case "treatment":
        switch (treatmentFilters.mapType) {
          case TreatmentMapType.TREATMENT_FAILURE:
            return <TreatmentFailureFilters />;
          case TreatmentMapType.DELAYED_PARASITE_CLEARANCE:
            return <DelayedParasiteClearanceFilters />;
          case TreatmentMapType.MOLECULAR_MARKERS:
            return <MolecularMarkerFilters />;
          default:
            return <div />;
        }
      case "invasive":
        switch (invasiveFilters.mapType) {
          case InvasiveMapType.VECTOR_OCCURANCE:
            return <VectorOccuranceFilters />;
          default:
            return <div />;
        }
      default:
        return <div />;
    }
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={filtersOpen}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <AppBar position="static" color="inherit">
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            aria-label="full width tabs example"
          >
            <Tab
              className={classes.tab}
              icon={<FilterIcon />}
              label="Filters"
            />
            <Tab className={classes.tab} icon={<GlobeIcon />} label="Regions" />
          </Tabs>
        </AppBar>
        <FiltersWrapper>
          {value === 0 ? (
            resolveFilters()
          ) : (
            <FilterWrapper>
              <FormLabel component="legend">Country</FormLabel>
              <Divider />
              <CountrySelector />
            </FilterWrapper>
          )}
        </FiltersWrapper>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: filtersOpen
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
