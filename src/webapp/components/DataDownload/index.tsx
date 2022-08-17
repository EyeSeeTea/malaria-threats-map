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
import { exportToCSV, Tab } from "./download";
import styled from "styled-components";
import { selectPreventionStudies } from "../../store/reducers/prevention-reducer";
import { selectInvasiveStudies } from "../../store/reducers/invasive-reducer";
import { addDataDownloadRequestAction } from "../../store/actions/data-download-actions";
import { format } from "date-fns";
import { emailRegexp } from "../Subscription";
import SimpleLoader from "../SimpleLoader";
import { setTimeout } from "timers";
import PaperStepper from "../PaperStepper/PaperStepper";
import CheckIcon from "@mui/icons-material/Check";
import { mapInvasiveStudiesToCSV, mapPreventionStudiesToCSV, mapTreatmentStudiesToCSV } from "./mappers/cvsMapper";

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

export type UserInfo = {
    firstName: string;
    lastName: string;
    organizationType: string;
    organizationName: string;
    uses: string;
    country: string;
    email: string;
    contactConsent: boolean;
    piConsent: boolean;
};

export type TermsInfo = {
    agreement: boolean;
};

export type DataInfo = {
    theme: string;
    preventionDataset: string;
    treatmentDataset: string;
    invasiveDataset: string;
    insecticideClasses: string[];
    insecticideTypes: string[];
    mechanismTypes: string[];
    molecularMarkers: string[];
    types: string[];
    synergistTypes: string[];
    plasmodiumSpecies: string[];
    species: string[];
    drugs: string[];
    years: number[];
    countries: string[];
};

export type Download = {
    firstName: string;
    lastName: string;
    organizationType: string;
    organizationName: string;
    uses: string;
    position: string;
    country: string;
    email: string;
    date: string;
    researchInfo: string;
    policiesInfo: string;
    contactConsent: boolean;
    organisationProjectConsent: boolean;
    toolsInfo: string;
    implementationCountries: string;
    theme: string;
    dataset: string;
};

export type Contact = {
    email: string;
    firstName: string;
    lastName: string;
    organization: string;
    country: string;
};

function DataDownload({ preventionStudies, treatmentStudies, invasiveStudies, logEvent, addDownload }: Props) {
    const { t } = useTranslation();
    const [activeStep, setActiveStep] = React.useState(0);
    const [downloading, setDownloading] = React.useState(false);
    const [messageLoader, setMessageLoader] = React.useState("");

    React.useEffect(() => {
        logEvent({
            category: "download",
            action: "step",
            label: (activeStep + 1).toString(),
        });
    }, [activeStep, logEvent]);

    const [termsInfo, setTermsInfo] = React.useState<Partial<TermsInfo>>({});
    const [userInfo, setUserInfo] = React.useState<Partial<UserInfo>>({});

    const [dataInfo, setDataInfo] = React.useState({
        theme: "prevention",
        preventionDataset: undefined,
        treatmentDataset: undefined,
        invasiveDataset: undefined,
        insecticideClasses: [],
        insecticideTypes: [],
        mechanismTypes: [],
        molecularMarkers: [],
        types: [],
        synergistTypes: [],
        plasmodiumSpecies: [],
        species: [],
        drugs: [],
        years: [],
        countries: [],
    });

    const onChangeTermsInfo = (field: keyof TermsInfo, value: any) => {
        setTermsInfo({ ...termsInfo, [field]: value });
    };
    const onChangeUserInfo = (field: keyof UserInfo, value: any) => {
        setUserInfo({ ...userInfo, [field]: value });
    };

    const steps = getSteps();

    const handleNext = () => {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    };

    const downloadData = () => {
        setDownloading(true);
        setMessageLoader(t("common.data_download.loader.fetching_data"));

        setTimeout(() => {
            const request: Download = {
                firstName: userInfo.firstName,
                lastName: userInfo.lastName,
                organizationType: t(`common.${userInfo.organizationType}`),
                organizationName: userInfo.organizationName,
                uses: userInfo.uses,
                country: userInfo.country,
                email: userInfo.email,
                contactConsent: userInfo.contactConsent,
                organisationProjectConsent: userInfo.piConsent,
                theme: dataInfo.theme,
                dataset: t(
                    `common.${dataInfo.preventionDataset || dataInfo.treatmentDataset || dataInfo.invasiveDataset}`
                ),
                position: "", // TODO: Old field in backed
                researchInfo: "", // TODO: Old field in backed
                policiesInfo: "", // TODO: Old field in backed
                toolsInfo: "", // TODO: Old field in backed
                implementationCountries: "", // TODO: Old field in backed
                date: null, // TODO: Old field in backed
            };

            const dateString = format(new Date(), "yyyyMMdd");

            let dataset;
            switch (dataInfo.theme) {
                case "prevention": {
                    const preventionTabs = mapPreventionStudiesToCSV(preventionStudies, dataInfo);
                    dataset = dataInfo.preventionDataset;
                    changeLoaderAndExportToCSV(preventionTabs, `MTM_${dataInfo.preventionDataset}_${dateString}`);
                    break;
                }
                case "treatment": {
                    const treatmentTabs = mapTreatmentStudiesToCSV(treatmentStudies, dataInfo);
                    dataset = dataInfo.treatmentDataset;
                    changeLoaderAndExportToCSV(treatmentTabs, `MTM_${dataInfo.treatmentDataset}_${dateString}`);
                    break;
                }
                case "invasive": {
                    const invasiveTabs = mapInvasiveStudiesToCSV(invasiveStudies, dataInfo);
                    dataset = dataInfo.invasiveDataset;
                    changeLoaderAndExportToCSV(invasiveTabs, `MTM_${dataInfo.invasiveDataset}_${dateString}`);
                    break;
                }
            }

            addDownload(request);

            logEvent({ category: "Download", action: "download", label: dataset || undefined });
        }, 100);
    };

    const changeLoaderAndExportToCSV = (tabs: Tab[], filename: string) => {
        setMessageLoader(t("common.data_download.loader.generating_file"));
        setTimeout(() => {
            exportToCSV(tabs, filename);
            setDownloading(false);
        }, 100);
    };

    const isWelcomeFormValid = () => {
        return termsInfo.agreement;
    };

    const isUserFormValid = () => {
        return (
            userInfo.firstName &&
            userInfo.lastName &&
            userInfo.uses &&
            userInfo.country &&
            userInfo.organizationType &&
            userInfo.organizationName &&
            emailRegexp.test(userInfo.email)
        );
    };

    const isDownloadFormValid = () => {
        return (
            (theme === "prevention" && preventionDataset) ||
            (theme === "treatment" && treatmentDataset) ||
            (theme === "invasive" && invasiveDataset)
        );
    };

    const renderStep = () => {
        switch (activeStep) {
            case 0:
                return <Filters onChange={setDataInfo} selections={dataInfo} />;
            case 1:
                return <UserForm userInfo={userInfo} onChange={onChangeUserInfo} />;
            case 2:
                return <Terms termsInfo={termsInfo} dataInfo={dataInfo} onChange={onChangeTermsInfo} />;
            default:
                return <div />;
        }
    };

    const { theme, preventionDataset, treatmentDataset, invasiveDataset } = dataInfo;

    const isStepValid = () => {
        switch (activeStep) {
            case 0:
                return isDownloadFormValid();
            case 1:
                return isDownloadFormValid() && isUserFormValid();
            case 2:
                return isDownloadFormValid() && isUserFormValid() && isWelcomeFormValid();
        }
    };

    const isFormValid = () => isWelcomeFormValid() && isUserFormValid() && isDownloadFormValid();

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
                            {/* <StepButton>{t(`common.${label}`)}</StepButton> */}
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
                        onClick={() => downloadData()}
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
