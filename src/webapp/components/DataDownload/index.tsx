import React from "react";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { State } from "../../store/types";
import { connect } from "react-redux";
import { Button, Container, StepLabel, stepLabelClasses } from "@mui/material";
import StepConnector, { stepConnectorClasses } from "@mui/material/StepConnector";
import Step from "@mui/material/Step";
import { logEventAction } from "../../store/actions/base-actions";
import { useTranslation } from "react-i18next";
import { selectTreatmentStudies } from "../../store/reducers/treatment-reducer";
import UserForm from "./UserForm";
import Terms from "./Terms";
import Filters from "./Filters";
import styled from "styled-components";
import { selectPreventionStudies } from "../../store/reducers/prevention-reducer";
import { selectInvasiveStudies } from "../../store/reducers/invasive-reducer";
import { addDataDownloadRequestAction } from "../../store/actions/data-download-actions";
import SimpleLoader from "../SimpleLoader";
import PaperStepper from "../PaperStepper/PaperStepper";
import CheckIcon from "@mui/icons-material/Check";
import { useDownload } from "./useDownload";

const Wrapper = styled.div`
    margin: 16px 0;
`;

const mapStateToProps = (state: State) => ({
    preventionStudies: selectPreventionStudies(state),
    treatmentStudies: selectTreatmentStudies(state),
    invasiveStudies: selectInvasiveStudies(state),
});

const mapDispatchToProps = {
    addDownload: addDataDownloadRequestAction,
    logEvent: logEventAction,
};
type OwnProps = {};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps & OwnProps;

function getSteps() {
    return ["data_download.step3.title", "data_download.personal_step.title", "data_download.terms_step.title"];
}

export type Contact = {
    email: string;
    firstName: string;
    lastName: string;
    organization: string;
    country: string;
};

function DataDownload({ preventionStudies, treatmentStudies, invasiveStudies, logEvent, addDownload }: Props) {
    const { t } = useTranslation();
    const {
        activeStep,
        downloading,
        messageLoader,
        dataInfo,
        userInfo,
        termsInfo,
        isStepValid,
        isFormValid,
        downloadData,
        handleNext,
        handleBack,
        onChangeDataInfo,
        onChangeUserInfo,
        onChangeTermsInfo,
    } = useDownload(logEvent, addDownload);

    const steps = getSteps();

    const renderStep = () => {
        switch (activeStep) {
            case 0:
                return <Filters selections={dataInfo} onChange={onChangeDataInfo} />;
            case 1:
                return <UserForm userInfo={userInfo} onChange={onChangeUserInfo} />;
            case 2:
                return <Terms termsInfo={termsInfo} dataInfo={dataInfo} onChange={onChangeTermsInfo} />;
            default:
                return <div />;
        }
    };

    return (
        <StyledContainer maxWidth="xl">
            {downloading && <SimpleLoader message={messageLoader} />}

            <Container maxWidth="md">
                <PaperStepper alternativeLabel activeStep={activeStep} connector={<StyledStepConnector />}>
                    {steps.map((label, index) => (
                        <Step key={label}>
                            <StyledStepLabel
                                icon={
                                    <StepIcon disabled={index > activeStep}>
                                        {index < activeStep ? <CheckIcon /> : <p>{index + 1}</p>}
                                    </StepIcon>
                                }
                            >
                                {t(`common.${label}`)}
                            </StyledStepLabel>
                        </Step>
                    ))}
                </PaperStepper>
            </Container>

            <Wrapper>{renderStep()}</Wrapper>

            <Container
                maxWidth="xs"
                sx={{ display: "flex", flexDirection: "row", marginTop: 4, justifyContent: "center" }}
            >
                <BackButton variant="outlined" disabled={activeStep === 0} onClick={handleBack} size="large">
                    {t("common.data_download.buttons.back")}
                </BackButton>
                {activeStep < steps.length - 1 && (
                    <PrimaryButton
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                        disabled={!isStepValid()}
                        size="large"
                    >
                        {t("common.data_download.buttons.next")}
                    </PrimaryButton>
                )}
                {activeStep === steps.length - 1 && (
                    <PrimaryButton
                        startIcon={<CloudDownloadIcon />}
                        variant={"contained"}
                        color={"primary"}
                        disabled={!isFormValid()}
                        onClick={() => downloadData(preventionStudies, treatmentStudies, invasiveStudies)}
                        size="large"
                    >
                        {t("common.data_download.buttons.download")}
                    </PrimaryButton>
                )}
            </Container>
        </StyledContainer>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(DataDownload);

const StyledContainer = styled(Container)`
    background: #ffffff;
    margin-top: 80px;
`;

const StepIcon = styled.div<{ disabled: boolean }>`
    background-color: ${({ disabled }) => (disabled ? "#DDDDDD" : "#2FB3AF")};
    color: #fff;
    width: 40px;
    padding: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    font-size: 18px;
    border-radius: 50%;
    margin-top: -13px;
    font-weight: 500;
    z-index: 1;
`;

const StyledStepConnector = styled(StepConnector)(() => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 10,
        left: "calc(-50% + 26px)",
        right: "calc(50% + 26px)",
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: "#2FB3AF",
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: "#2FB3AF",
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        borderColor: "#DDDDDD",
        borderTopWidth: 2,
    },
}));

const StyledStepLabel = styled(StepLabel)(() => ({
    [`& .${stepLabelClasses.label}`]: {
        [`&.${stepLabelClasses.completed}`]: {
            color: "#2FB3AF",
        },
        [`&.${stepLabelClasses.active}`]: {
            color: "#2FB3AF",
        },
        color: "#C6C6C6",
    },
}));

const BackButton = styled(Button)`
    background-color: transparent;
    border: 1px solid#AAAAAA;
    color: #999999;
    &:hover {
        background-color: #f5f5f5;
        border: 2px solid#AAAAAA;
    }
    font-size: 20px;
    padding: 12px 24px;
    cursor: pointer;
`;

const PrimaryButton = styled(Button)`
    color: white;
    font-size: 20px;
    margin-left: 16px;
    padding: 12px 24px;
    cursor: pointer;
`;
