import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Paper } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import styled from "styled-components";
import { State } from "../store/types";
import { selectFilters } from "../store/reducers/base-reducer";
import { setStoryModeAction } from "../store/actions/base-actions";
import { connect } from "react-redux";

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
  return ["Select campaign settings", "Create an ad group", "Create an ad"];
}
const mapStateToProps = (state: State) => ({
  filters: selectFilters(state)
});

const mapDispatchToProps = {
  setStoryMode: setStoryModeAction
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

function StoryModeStepper({ setStoryMode }: Props) {
  const classes = useStyles({});
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());
  const steps = getSteps();

  const isStepOptional = (step: number) => {
    return step === 1;
  };

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
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: { optional?: React.ReactNode } = {};
          if (isStepOptional(index)) {
            // labelProps.optional = (
            //   <Typography variant="caption">Optional</Typography>
            // );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{""}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div>
        <div>
          <Paper className={classes.paper}>
            <Typography variant={"h6"} className={classes.title}>
              <b>
                Malaria parasites repeatedly develop resistance to antimalarial
                treatment
              </b>
            </Typography>
            <br />
            <Typography variant={"body2"}>
              <b>
                For decades, drug resistance has been one of the main obstacles
                in the fight against malaria.
              </b>
            </Typography>
            <br />
            <Typography variant={"body2"}>
              Continuous global monitoring and reporting of drug efficacy and
              parasite resistance is critical to ensure patients receive
              effective treatment. WHO supports national malaria control
              programmes to monitor antimalarial treatment efficacy and to track
              the genetic changes linked to drug resistance in malaria
              parasites.
            </Typography>
            <Typography variant={"body2"}>
              The critical role of monitoring drug efficacy has been observed
              worldwide. Resistance has been a persistent challenge in the
              Greater Mekong Subregion. The region has been very active in
              monitoring drug efficacy.
            </Typography>
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
