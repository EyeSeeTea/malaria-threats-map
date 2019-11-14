import React from "react";
import AppBar from "@material-ui/core/AppBar/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { GlobeIcon } from "./Icons";
import FilterIcon from "@material-ui/icons/FilterList";
import CloseIcon from "@material-ui/icons/Close";
import CountrySelector from "./filters/CountrySelector";
import ResistanceStatusFilters, {
  Divider,
  FilterWrapper
} from "./layers/prevention/ResistanceStatus/ResistanceStatusFilters";
import FormLabel from "@material-ui/core/FormLabel";
import styled from "styled-components";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import {
  DiagnosisMapType,
  InvasiveMapType,
  PreventionMapType,
  State,
  TreatmentMapType
} from "../store/types";
import { selectFiltersMode, selectTheme } from "../store/reducers/base-reducer";
import { selectPreventionFilters } from "../store/reducers/prevention-reducer";
import { selectDiagnosisFilters } from "../store/reducers/diagnosis-reducer";
import { selectTreatmentFilters } from "../store/reducers/treatment-reducer";
import { selectInvasiveFilters } from "../store/reducers/invasive-reducer";
import { setFiltersMode, setFiltersOpen } from "../store/actions/base-actions";
import { connect } from "react-redux";
import IntensityStatusFilters from "./layers/prevention/IntensityStatus/IntensityStatusFilters";
import ResistanceMechanismFilters from "./layers/prevention/ResistanceMechanisms/ResistanceMechanismFilters";
import LevelOfInvolvementFilters from "./layers/prevention/Involvement/LevelOfInvolvementFilters";
import PboDeploymentFilters from "./layers/prevention/PboDeployment/PboDeploymentFilters";
import GeneDeletionFilters from "./layers/diagnosis/GeneDeletions/GeneDeletionFilters";
import TreatmentFailureFilters from "./layers/treatment/TreatmentFailure/TreatmentFailureFilters";
import DelayedParasiteClearanceFilters from "./layers/treatment/DelayedParasiteClearance/DelayedParasiteClearanceFilters";
import MolecularMarkerFilters from "./layers/treatment/MolecularMarkers/MolecularMarkerFilters";
import VectorOccuranceFilters from "./layers/invasive/VectorOccurance/VectorOccuranceFilters";
import RegionSelector from "./filters/RegionSelector";
import SubRegionSelector from "./filters/SubRegionSelector";

const FiltersWrapper = styled.div`
  margin-top: 20px;
`;

const FlexGrow = styled.div`
  flex-grow: 1;
`;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
    },
    tab: {
      minWidth: 0
    }
  })
);
const mapStateToProps = (state: State) => ({
  theme: selectTheme(state),
  filtersMode: selectFiltersMode(state),
  preventionFilters: selectPreventionFilters(state),
  diagnosisFilters: selectDiagnosisFilters(state),
  treatmentFilters: selectTreatmentFilters(state),
  invasiveFilters: selectInvasiveFilters(state)
});
const mapDispatchToProps = {
  setFiltersOpen: setFiltersOpen,
  setFiltersMode: setFiltersMode
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const tabs = ["filters", "regions"];

const FiltersSidebar = ({
  theme,
  filtersMode,
  setFiltersOpen,
  setFiltersMode,
  preventionFilters,
  diagnosisFilters,
  treatmentFilters,
  invasiveFilters
}: Props) => {
  const classes = useStyles({});

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setFiltersMode(tabs[newValue]);
  };

  const handleClose = () => {
    setFiltersOpen(false);
  };

  const value = tabs.indexOf(filtersMode);

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
    <div>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar variant="dense">
          <FlexGrow />
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            size={"small"}
            aria-label="close"
          >
            <CloseIcon fontSize={"small"} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <AppBar position="static" color="inherit">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab className={classes.tab} icon={<FilterIcon />} label="Filters" />
          <Tab className={classes.tab} icon={<GlobeIcon />} label="Regions" />
        </Tabs>
      </AppBar>
      <FiltersWrapper>
        {value === 0 ? (
          resolveFilters()
        ) : (
          <div>
            <FilterWrapper>
              <FormLabel component="legend">Country</FormLabel>
              <Divider />
              <CountrySelector />
            </FilterWrapper>
            <FilterWrapper>
              <FormLabel component="legend">Region</FormLabel>
              <Divider />
              <RegionSelector />
            </FilterWrapper>
            <FilterWrapper>
              <FormLabel component="legend">Subregion</FormLabel>
              <Divider />
              <SubRegionSelector />
            </FilterWrapper>
          </div>
        )}
      </FiltersWrapper>
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FiltersSidebar);
