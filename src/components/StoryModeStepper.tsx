import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import { Paper } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import styled from "styled-components";
import { State } from "../store/types";
import { selectFilters, selectTheme } from "../store/reducers/base-reducer";
import { setStoryModeAction } from "../store/actions/base-actions";
import { connect } from "react-redux";
import PreventionSteps from "./story/prevention/PreventionSteps";
import DiagnosisSteps from "./story/diagnosis/DiagnosisSteps";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import TreatmentSteps from "./story/treatment/TreatmentSteps";
import InvasiveSteps from "./story/invasive/InvasiveSteps";

const FlexGrow = styled.div`
  flex-grow: 1;
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    title: {
      lineHeight: 1.3
    },
    button: {
      marginRight: theme.spacing(1)
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1)
    },
    paper: {
      margin: theme.spacing(2),
      padding: theme.spacing(2)
    },
    buttons: {
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2)
    },
    appBar: {
      position: "relative"
    }
  })
);

function getSteps() {
  return ["", "", "", ""];
}
const mapStateToProps = (state: State) => ({
  theme: selectTheme(state),
  filters: selectFilters(state)
});

const mapDispatchToProps = {
  setStoryMode: setStoryModeAction
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

type Steps = { [value: string]: any[] };

const stepsMap = (language: string) => ({
  prevention: (PreventionSteps as Steps)[language],
  diagnosis: (DiagnosisSteps as Steps)[language],
  treatment: (TreatmentSteps as Steps)[language],
  invasive: (InvasiveSteps as Steps)[language]
});

function StoryModeStepper({ theme, setStoryMode }: Props) {
  const classes = useStyles({});
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());
  const steps = getSteps();

  useTranslation("common");
  const language = i18next.language || window.localStorage.i18nextLng;

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleClose = () => {
    setStoryMode(false);
  };

  const themeMap = stepsMap(language) as Steps;
  const selectedSteps = themeMap[theme];
  const SelectedStep = selectedSteps[activeStep];

  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar}>
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
      <Stepper activeStep={activeStep}>
        {selectedSteps.map((step: any, index: number) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: { optional?: React.ReactNode } = {};
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step
              key={index}
              {...stepProps}
              onClick={() => setActiveStep(index)}
            >
              <StepLabel {...labelProps}>{""}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div>
        <div>
          <Paper className={classes.paper}>
            {SelectedStep ? <SelectedStep /> : <div />}
          </Paper>
          <div className={classes.buttons}>
            <Button
              variant="contained"
              color="default"
              onClick={handleBack}
              disabled={activeStep === 0}
              className={classes.button}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={activeStep === steps.length - 1}
              className={classes.button}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StoryModeStepper);
