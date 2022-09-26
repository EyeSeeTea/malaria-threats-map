import React, { useState } from "react";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import { Step, StepLabel, Button, Paper } from "@mui/material";
import styled from "styled-components";
import PreventionSteps from "./story/prevention/PreventionSteps";
import DiagnosisSteps from "./story/diagnosis/DiagnosisSteps";
import { useTranslation } from "react-i18next";
import TreatmentSteps from "./story/treatment/TreatmentSteps";
import InvasiveSteps from "./story/invasive/InvasiveSteps";
import { useSwipeable, SwipeEventData } from "react-swipeable";
import PaperStepper from "./PaperStepper/PaperStepper";

const StyledStepLabel = styled(StepLabel)`
    cursor: pointer;
`;
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            height: "100%",
        },
        title: {
            flexGrow: 1,
        },
        button: {
            marginRight: theme.spacing(1),
            padding: "10px 50px",
            backgroundColor: "#1899CC",
            color: "white",
            fontWeight: "bold",
            fontSize: "17px",
            "@media(max-width: 768px)": {
                fontSize: "12px",
                padding: "6px 30px",
            },
        },
        instructions: {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
        },
        paper: {
            position: "relative",
            margin: theme.spacing(2),
            marginTop: "55px",
            padding: theme.spacing(2),
            paddingBottom: "80px",
            "@media(min-width: 1536px)": {
                height: "82%",
            },
            height: "78%",
        },
        buttons: {
            position: "absolute",
            display: "flex",
            bottom: "20px",
            width: "90%",
            justifyContent: "space-between",
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

type Props = {
    theme: "prevention" | "invasive" | "treatment" | "diagnosis";
};

type Steps = { [value: string]: any[] };

function StoryModeStepper({ theme }: Props) {
    const { t } = useTranslation();
    const [storyModeStep, setStoryModeStep] = useState<number>(0);
    const classes = useStyles({});
    const steps = getSteps();

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
        <div {...swipeableHandlers} style={{ height: "100%" }}>
            <div className={classes.root}>
                <Paper className={classes.paper}>
                    <PaperStepper activeStep={storyModeStep}>
                        {selectedSteps.map((step: any, index: number) => {
                            const stepProps: { completed?: boolean } = {};
                            const labelProps: { optional?: React.ReactNode } = {};
                            return (
                                <Step
                                    key={index}
                                    {...stepProps}
                                    onClick={() => setStoryModeStep(index)}
                                    sx={{
                                        "& .MuiSvgIcon-root": {
                                            zIndex: 1,
                                            color: "#fff",
                                            width: 33,
                                            height: 33,
                                            display: "flex",
                                            fill: "#D3D3D3",
                                            cursor: "pointer",
                                        },
                                        "& .MuiSvgIcon-root.Mui-active": {
                                            fill: "#1899CC",
                                        },
                                        "& .MuiSvgIcon-root.Mui-completed": {
                                            fill: "#1899CC",
                                        },
                                        "& .MuiStepIcon-text": {
                                            fill: "white",
                                            fontSize: "11px",
                                        },
                                    }}
                                >
                                    <StyledStepLabel {...labelProps}>{""}</StyledStepLabel>
                                </Step>
                            );
                        })}
                    </PaperStepper>
                    {SelectedStep ? <SelectedStep /> : <div />}
                    <div className={classes.buttons}>
                        {storyModeStep > 0 && (
                            <Button
                                variant="contained"
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
                </Paper>
            </div>
        </div>
    );
}

export default StoryModeStepper;
