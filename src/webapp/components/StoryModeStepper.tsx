import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Stepper, Step, StepLabel, Button, Paper, Typography, AppBar, Toolbar, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import styled from "styled-components";
import { State } from "../store/types";
import { selectFilters, selectStoryModeStep, selectTheme } from "../store/reducers/base-reducer";
import { setStoryModeAction, setStoryModeStepAction } from "../store/actions/base-actions";
import { connect } from "react-redux";
import PreventionSteps from "./story/prevention/PreventionSteps";
import DiagnosisSteps from "./story/diagnosis/DiagnosisSteps";
import { useTranslation } from "react-i18next";
import TreatmentSteps from "./story/treatment/TreatmentSteps";
import InvasiveSteps from "./story/invasive/InvasiveSteps";
import { useSwipeable, SwipeEventData } from "react-swipeable";

const FlexGrow = styled.div`
    flex-grow: 1;
`;

const StyledStepLabel = styled(StepLabel)`
    cursor: pointer;
`;

const StyledStep = styled(Step)`
    cursor: pointer;
`;
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {},
        title: {
            flexGrow: 1,
        },
        button: {
            marginRight: theme.spacing(1),
        },
        instructions: {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
        },
        paper: {
            margin: theme.spacing(2),
            padding: theme.spacing(2),
        },
        buttons: {
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
        },
        appBar: {
            position: "relative",
        },
    })
);

function getSteps() {
    return ["", "", "", ""];
}
const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    filters: selectFilters(state),
    storyModeStep: selectStoryModeStep(state),
});

const mapDispatchToProps = {
    setStoryMode: setStoryModeAction,
    setStoryModeStep: setStoryModeStepAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

type Steps = { [value: string]: any[] };

function StoryModeStepper({ theme, setStoryMode, setStoryModeStep, storyModeStep }: Props) {
    const classes = useStyles({});
    const steps = getSteps();

    const { t } = useTranslation();

    const handleNext = () => {
        setStoryModeStep(storyModeStep + 1);
    };

    const handleBack = () => {
        setStoryModeStep(storyModeStep - 1);
    };

    const handleSwipe = (swipe: SwipeEventData) => {
        if (swipe.dir === "Left" && storyModeStep > 0) {
            handleBack();
        } else if (swipe.dir === "Right" && storyModeStep < steps.length - 1) {
            handleNext();
        }
    };

    const swipeableHandlers = useSwipeable({
        onSwiped: handleSwipe,
        delta: 10, // min distance(px) before a swipe starts
        preventDefaultTouchmoveEvent: false, // preventDefault on touchmove, *See Details*
        trackTouch: true, // track touch input
        trackMouse: false, // track mouse input
        rotationAngle: 0, // set a rotation angle
    });

    const handleClose = () => {
        setStoryMode(false);
    };

    const themeMap = {
        invasive: InvasiveSteps,
        diagnosis: DiagnosisSteps,
        treatment: TreatmentSteps,
        prevention: PreventionSteps,
    } as Steps;

    const selectedSteps = themeMap[theme];

    const SelectedStep = selectedSteps[storyModeStep];

    if (storyModeStep < 0 || storyModeStep > selectedSteps.length - 1) {
        setStoryModeStep(0);
    }

    return (
        <div {...swipeableHandlers}>
            <div className={classes.root}>
                <AppBar className={classes.appBar}>
                    <Toolbar variant="dense">
                        <Typography variant="subtitle1" className={classes.title}>
                            {t(`common.themes.${theme}`)}
                        </Typography>
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
                <Stepper activeStep={storyModeStep}>
                    {selectedSteps.map((step: any, index: number) => {
                        const stepProps: { completed?: boolean } = {};
                        const labelProps: { optional?: React.ReactNode } = {};
                        return (
                            <StyledStep key={index} {...stepProps} onClick={() => setStoryModeStep(index)}>
                                <StyledStepLabel {...labelProps}>{""}</StyledStepLabel>
                            </StyledStep>
                        );
                    })}
                </Stepper>
                <div>
                    <div>
                        <Paper className={classes.paper}>{SelectedStep ? <SelectedStep /> : <div />}</Paper>
                        <div className={classes.buttons}>
                            {storyModeStep > 0 && (
                                <Button
                                    variant="contained"
                                    color="default"
                                    onClick={handleBack}
                                    disabled={storyModeStep === 0}
                                    className={classes.button}
                                >
                                    Back
                                </Button>
                            )}
                            {storyModeStep < selectedSteps.length - 1 && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleNext}
                                    disabled={storyModeStep === steps.length - 1}
                                    className={classes.button}
                                >
                                    Next
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(StoryModeStepper);
