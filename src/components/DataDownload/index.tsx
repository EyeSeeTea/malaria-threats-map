import React from "react";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { State } from "../../store/types";
import { connect } from "react-redux";
import {
  AppBar,
  Button,
  Container,
  createStyles,
  DialogActions,
  Fab,
  makeStyles,
  Theme,
  Toolbar,
  Typography
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepButton from "@material-ui/core/StepButton";
import { selectIsDataDownloadOpen } from "../../store/reducers/base-reducer";
import { setDataDownloadOpenAction } from "../../store/actions/base-actions";
import { useTranslation } from "react-i18next";
import { selectTreatmentStudies } from "../../store/reducers/treatment-reducer";
import UserForm from "./UserForm";
import UseForm from "./UseForm";
import Welcome from "./Welcome";
import Filters from "./Filters";
import { exportToCSV } from "./download";
import { FlexGrow } from "../Chart";
import styled from "styled-components";
import { selectPreventionStudies } from "../../store/reducers/prevention-reducer";
import {
  filterByAssayTypes,
  filterByCountries,
  filterByInsecticideClasses,
  filterByInsecticideTypes,
  filterBySpecies,
  filterByTypes,
  filterByYearRange,
  filterByYears
} from "../layers/studies-filters";
import { Option } from "../BasicSelect";
import mappings from "./mappings/index";

const Wrapper = styled.div`
  margin: 16px 0;
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
      whiteSpace: "nowrap"
    },
    fab: {
      pointerEvents: "all",
      margin: theme.spacing(0.5, 0)
    },
    form: {
      display: "flex",
      flexDirection: "column",
      margin: "auto",
      width: "fit-content"
    },
    formControl: {
      marginTop: theme.spacing(2),
      minWidth: 120
    },
    formControlLabel: {
      marginTop: theme.spacing(1)
    },
    button: {
      marginRight: theme.spacing(1)
    },
    appBar: {
      position: "relative"
    }
  })
);

const mapStateToProps = (state: State) => ({
  isDataDownloadOpen: selectIsDataDownloadOpen(state),
  preventionStudies: selectPreventionStudies(state),
  treatmentStudies: selectTreatmentStudies(state),
  invasiveStudies: selectPreventionStudies(state)
});

const mapDispatchToProps = {
  setDataDownloadOpen: setDataDownloadOpenAction
};
type OwnProps = {};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps & OwnProps;

function getSteps() {
  return [
    "data_download.step0.title",
    "data_download.step1.title",
    "data_download.step2.title",
    "data_download.step3.title"
  ];
}

function Index({
  isDataDownloadOpen,
  setDataDownloadOpen,
  preventionStudies,
  treatmentStudies,
  invasiveStudies
}: Props) {
  const classes = useStyles({});
  const { t } = useTranslation("common");
  const [activeStep, setActiveStep] = React.useState(3);
  const [selections, setSelections] = React.useState({
    theme: "prevention",
    preventionDataset: undefined,
    treatmentDataset: undefined,
    invasiveDataset: undefined,
    insecticideClasses: [],
    insecticideTypes: [],
    mechanismTypes: [],
    types: [],
    synergistTypes: [],
    plasmodiumSpecies: [],
    species: [],
    drugs: [],
    years: [],
    countries: []
  });
  const handleToggle = () => {
    setDataDownloadOpen(!isDataDownloadOpen);
  };
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const filterStudies = (baseStudies: any[], filters: any[]) => {
    return filters.reduce(
      (studies, filter) => studies.filter(filter),
      baseStudies
    );
  };

  const buildResults = (studies: any, mappings: Option[]) => {
    return studies.map((study: { [key: string]: any }) =>
      mappings.reduce(
        (acc: any, field: Option) => ({
          ...acc,
          [field.label]: study[field.value]
        }),
        {}
      )
    );
  };

  const downloadPreventionData = () => {
    switch (selections.preventionDataset) {
      case "DISCRIMINATING_CONCENTRATION_BIOASSAY":
      case "INTENSITY_CONCENTRATION_BIOASSAY": {
        const filters = [
          filterByAssayTypes([selections.preventionDataset]),
          filterByInsecticideClasses(selections.insecticideClasses),
          filterByInsecticideTypes(selections.insecticideTypes),
          filterByTypes(selections.types),
          filterBySpecies(selections.species),
          filterByCountries(selections.countries),
          filterByYears(selections.years)
        ];
        const studies = filterStudies(preventionStudies, filters);
        const results = buildResults(
          studies,
          mappings[selections.preventionDataset]
        );
        exportToCSV(results, [], "file");
        break;
      }
      case "SYNERGIST-INSECTICIDE_BIOASSAY": {
        const filters = [
          filterByAssayTypes([selections.preventionDataset]),
          filterByTypes(selections.types),
          filterBySpecies(selections.species),
          filterByCountries(selections.countries),
          filterByYears(selections.years)
        ];
        const studies = filterStudies(preventionStudies, filters);
        const results = buildResults(
          studies,
          mappings[selections.preventionDataset]
        );
        exportToCSV(results, [], "file");
        break;
      }
      case "MOLECULAR_ASSAY":
      case "BIOCHEMICAL_ASSAY": {
        const filters = [
          filterByAssayTypes([selections.preventionDataset]),
          filterBySpecies(selections.species),
          filterByCountries(selections.countries),
          filterByYears(selections.years)
        ];
        console.log(selections);
        const studies = filterStudies(preventionStudies, filters);
        console.log(studies);
        const results = buildResults(
          studies,
          mappings[selections.preventionDataset]
        );
        exportToCSV(results, [], "file");
        break;
      }
    }
  };

  const downloadData = () => {
    switch (selections.theme) {
      case "prevention":
        downloadPreventionData();
        break;
      case "treatment":
        downloadPreventionData();
        break;
      case "invasive":
        downloadPreventionData();
        break;
    }
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return <Welcome />;
      case 1:
        return <UserForm />;
      case 2:
        return <UseForm />;
      case 3:
        return <Filters onChange={setSelections} selections={selections} />;
      default:
        return <div />;
    }
  };

  const isLastStep = activeStep === steps.length - 1;
  const isFormValid = true;

  return (
    <div>
      <Fab
        size="small"
        color={isDataDownloadOpen ? "primary" : "default"}
        onClick={handleToggle}
        className={classes.fab}
        title={t("data_download.title")}
      >
        <CloudDownloadIcon />
      </Fab>
      <Dialog
        fullScreen
        open={isDataDownloadOpen}
        onClose={handleToggle}
        aria-labelledby="max-width-dialog-title"
      >
        <AppBar position={"relative"}>
          <Container maxWidth={"md"}>
            <Toolbar variant="dense">
              <Typography variant="h6" className={classes.title}>
                {t("data_download.title")}
              </Typography>
              <FlexGrow />
              <Button autoFocus color="inherit" onClick={handleToggle}>
                {t("data_download.buttons.close")}
              </Button>
            </Toolbar>
          </Container>
        </AppBar>
        <Container maxWidth={"md"}>
          <Stepper alternativeLabel nonLinear activeStep={activeStep}>
            {steps.map((label, index) => (
              <Step key={label} onClick={() => setActiveStep(index)}>
                <StepButton style={{ cursor: "pointer" }}>
                  {t(label)}
                </StepButton>
              </Step>
            ))}
          </Stepper>
        </Container>
        <Container maxWidth={"md"}>
          <Wrapper>{renderStep()}</Wrapper>
        </Container>
        <Container maxWidth={"md"}>
          <DialogActions>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              className={classes.button}
            >
              {t("data_download.buttons.back")}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              className={classes.button}
              disabled={activeStep === steps.length - 2}
            >
              {t("data_download.buttons.next")}
            </Button>
            <Button
              startIcon={<CloudDownloadIcon />}
              variant={"contained"}
              color={"primary"}
              disabled={!(isLastStep && isFormValid)}
              onClick={() => downloadData()}
            >
              {t("data_download.buttons.download")}
            </Button>
          </DialogActions>
        </Container>
      </Dialog>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Index);
