import React from "react";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { State } from "../../store/types";
import { connect } from "react-redux";
import { Button, Container, StepLabel, stepLabelClasses, Theme } from "@mui/material";
import StepConnector, { stepConnectorClasses } from "@mui/material/StepConnector";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import Step from "@mui/material/Step";
import { logEventAction } from "../../store/actions/base-actions";
import { useTranslation } from "react-i18next";
import { selectTreatmentStudies } from "../../store/reducers/treatment-reducer";
import UserForm from "./UserForm";
import UseForm, { isPoliciesActive, isResearchActive, isToolsActive } from "./UseForm";
import Terms from "./Terms";
import Filters from "./Filters";
import { exportToCSV, Tab } from "./download";
import styled from "styled-components";
import { selectPreventionStudies } from "../../store/reducers/prevention-reducer";
import {
    filterByAssayTypes,
    filterByCountries,
    filterByDimensionId,
    filterByDownload,
    filterByDrugs,
    filterByInsecticideClasses,
    filterByInsecticideTypes,
    filterByManyPlasmodiumSpecies,
    filterByMolecularMarkers,
    filterByMolecularMarkerStudyDimension255,
    filterBySpecies,
    filterByTypes,
    filterByYears,
} from "../layers/studies-filters";
import { Option } from "../BasicSelect";
import mappings from "./mappings/index";
import * as R from "ramda";
import { selectInvasiveStudies } from "../../store/reducers/invasive-reducer";
import { addDataDownloadRequestAction } from "../../store/actions/data-download-actions";
import { format } from "date-fns";
import { MOLECULAR_MARKERS } from "../filters/MolecularMarkerFilter";
import { PLASMODIUM_SPECIES_SUGGESTIONS } from "../filters/PlasmodiumSpeciesFilter";
import SimpleLoader from "../SimpleLoader";
import { setTimeout } from "timers";
import PaperStepper from "../PaperStepper/PaperStepper";
import CheckIcon from "@mui/icons-material/Check";
import { emailRegexp } from "../../../domain/common/regex";

export const MOLECULAR_MECHANISM_TYPES = ["MONO_OXYGENASES", "ESTERASES", "GSTS"];

export const BIOCHEMICAL_MECHANISM_TYPES = ["KDR_L1014S", "KDR_L1014F", "KDR_(MUTATION_UNSPECIFIED)", "ACE1R"];

const Wrapper = styled.div`
    margin: 16px 0;
`;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        title: {
            marginLeft: theme.spacing(2),
            flex: 1,
            whiteSpace: "nowrap",
        },
        fab: {
            pointerEvents: "all",
            margin: theme.spacing(0.5, 0),
        },
        form: {
            display: "flex",
            flexDirection: "column",
            margin: "auto",
            width: "fit-content",
        },
        formControl: {
            marginTop: theme.spacing(2),
            minWidth: 120,
        },
        formControlLabel: {
            marginTop: theme.spacing(1),
        },
        button: {
            marginRight: theme.spacing(1),
        },
        appBar: {
            position: "relative",
        },
    })
);

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
    return [
        "data_download.step3.title",
        "data_download.personal_step.title",
        "data_download.terms_step.title",
        "data_download.step2.title",
    ];
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

export type UseInfo = {
    uses: string[];
    countries: string[];
    studyDate: Date;
    researchInfo: string;
    policiesInfo: string;
    toolsInfo: string;
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
    years: string[];
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

const initialUseInfo: Partial<UseInfo> = {
    uses: [],
    countries: [],
    studyDate: new Date(),
};

function DataDownload({ preventionStudies, treatmentStudies, invasiveStudies, logEvent, addDownload }: Props) {
    const classes = useStyles({});
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
    const [useInfo, setUseInfo] = React.useState<Partial<UseInfo>>(initialUseInfo);

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

    const onChangeWelcomeInfo = (field: keyof TermsInfo, value: any) => {
        setTermsInfo({ ...termsInfo, [field]: value });
    };
    const onChangeUserInfo = (field: keyof UserInfo, value: any) => {
        setUserInfo({ ...userInfo, [field]: value });
    };
    const onChangeUseInfo = (field: keyof UseInfo, value: any) => {
        setUseInfo({ ...useInfo, [field]: value });
    };

    const steps = getSteps();

    const handleNext = () => {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    };

    const filterStudies = (baseStudies: any[], filters: any[]) => {
        return filters.reduce((studies, filter) => studies.filter(filter), baseStudies);
    };

    const resolveValue = (field: Option, study: any) => {
        if (field.value === "MM_TYPE") {
            return MOLECULAR_MARKERS.find(mm => mm.value === Number(study[field.value])).label;
        }
        if (field.value === "PLASMODIUM_SPECIES") {
            const value = PLASMODIUM_SPECIES_SUGGESTIONS.find(species => species.value === study[field.value]);

            return value ? value.label : undefined;
        }
        if (["Latitude", "Longitude"].includes(field.value)) {
            return Number(study[field.value]).toFixed(6);
        }
        if (
            [
                "CITATION",
                "CITATION_LONG",
                "CITATION_URL",
                "PROVINCE",
                "OBJECTID",
                "MONTH_END",
                "MONTH_START",
                "YEAR_END",
                "YEAR_START",
            ].includes(field.value)
        ) {
            return study[field.value];
        }
        if (["STAGE_ORIGIN", "STAGE"].includes(field.value)) {
            return String(study[field.value]).toUpperCase();
        }
        if (
            [
                "POSITIVE_DAY_3",
                "TREATMENT_FAILURE_PP",
                "TREATMENT_FAILURE_KM",
                "MORTALITY_ADJUSTED",
                "PROPORTION",
            ].includes(field.value)
        ) {
            if (!isNaN(study[field.value])) {
                return (parseFloat(study[field.value]) * 100).toFixed(2);
            }
            return study[field.value];
        }
        if (field.value === "ISO2") {
            if (field.label === "ISO2") {
                return study[field.value];
            } else {
                return t(`${study[field.value] === "NA" ? "common.COUNTRY_NA" : study[field.value]}`);
            }
        }
        if (!isNaN(study[field.value])) {
            return study[field.value];
        } else {
            return t(`${study[field.value]}`);
        }
    };

    const buildResults = (studies: any, mappings: Option[]) => {
        return studies.map((study: { [key: string]: any }) =>
            mappings.reduce(
                (acc: any, field: Option) => ({
                    ...acc,
                    [field.label]: resolveValue(field, study),
                }),
                {}
            )
        );
    };

    const changeLoaderAndExportToCSV = (tabs: Tab[], filename: string) => {
        setMessageLoader(t("common.data_download.loader.generating_file"));
        setTimeout(() => {
            exportToCSV(tabs, filename);
            setDownloading(false);
        }, 100);
    };

    const downloadPreventionData = () => {
        switch (dataInfo.preventionDataset) {
            case "DISCRIMINATING_CONCENTRATION_BIOASSAY":
            case "INTENSITY_CONCENTRATION_BIOASSAY": {
                const filters = [
                    filterByDownload(),
                    filterByAssayTypes([dataInfo.preventionDataset]),
                    filterByInsecticideClasses(dataInfo.insecticideClasses),
                    filterByInsecticideTypes(dataInfo.insecticideTypes),
                    filterByTypes(dataInfo.types),
                    filterBySpecies(dataInfo.species),
                    filterByCountries(dataInfo.countries),
                    filterByYears(dataInfo.years),
                ];
                const studies = filterStudies(preventionStudies, filters);
                const results = buildResults(studies, mappings[dataInfo.preventionDataset]);

                const fields = [
                    "ID",
                    "COUNTRY_NAME",
                    "SITE_NAME",
                    "ADMIN1",
                    "ADMIN2",
                    "SITE_CODE",
                    "LATITUDE",
                    "LONGITUDE",
                    "TEST_TYPE",
                    "INSECTICIDE_TYPE",
                    "INSECTICIDE_CONCENTRATION",
                    "YEAR_START",
                    "VECTOR_SPECIES",
                    "STAGE_ORIGIN",
                    "MOSQUITO_NUMBER",
                    "TIME_HOLDING_POSTEXPOSURE",
                    "MORTALITY_ADJUSTED",
                    "RESISTANCE_STATUS",
                    "DATA_SOURCE",
                    "CITATION",
                    "CITATION_URL",
                    "DATA_CURATOR",
                ];
                const tabs = [
                    {
                        name: t("disclaimerTab.name"),
                        studies: [
                            {
                                Disclaimer: t("disclaimerTab.disclaimer"),
                            },
                        ],
                    },
                    {
                        name: "Data",
                        studies: results,
                    },
                    {
                        name: "Glossary",
                        studies: fields.map(field => ({
                            "Variable name": field,
                            Description: t(`download.discrimination.${field}`),
                        })),
                    },
                ];
                const dateString = format(new Date(), "yyyyMMdd");
                changeLoaderAndExportToCSV(tabs, `MTM_${dataInfo.preventionDataset}_${dateString}`);
                break;
            }
            case "SYNERGIST-INSECTICIDE_BIOASSAY": {
                const filters = [
                    filterByDownload(),
                    filterByAssayTypes([dataInfo.preventionDataset]),
                    filterByTypes(dataInfo.types),
                    filterBySpecies(dataInfo.species),
                    filterByCountries(dataInfo.countries),
                    filterByYears(dataInfo.years),
                ];
                const studies = filterStudies(preventionStudies, filters);
                const results = buildResults(studies, mappings[dataInfo.preventionDataset]);
                const fields = [
                    "ID",
                    "COUNTRY_NAME",
                    "ADMIN1",
                    "ADMIN2",
                    "SITE_NAME",
                    "SITE_CODE",
                    "LATITUDE",
                    "LONGITUDE",
                    "TEST_TYPE",
                    "TYPE_SYNERGIST",
                    "INSECTICIDE_TYPE",
                    "INSECTICIDE_CONCENTRATION",
                    "SYNERGIST_TYPE",
                    "SYNERGIST_CONCENTRATION",
                    "YEAR_START",
                    "VECTOR_SPECIES",
                    "STAGE_ORIGIN",
                    "MOSQUITO_NUMBER",
                    "TIME_HOLDING_POSTEXPOSURE",
                    "MORTALITY_ADJUSTED_SYNERGIST_INSECTICIDE",
                    "MORTALITY_ADJUSTED_INSECTICIDE_ONLY",
                    "METABOLIC_MECHANISM_INVOLVEMENT",
                    "DATA_SOURCE",
                    "CITATION",
                    "CITATION_URL",
                    "DATA_CURATOR",
                ];
                const tabs = [
                    {
                        name: t("disclaimerTab.name"),
                        studies: [
                            {
                                Disclaimer: t("disclaimerTab.disclaimer"),
                            },
                        ],
                    },
                    {
                        name: "Data",
                        studies: results,
                    },
                    {
                        name: "Glossary",
                        studies: fields.map(field => ({
                            "Variable name": field,
                            Description: t(`download.synergist.${field}`),
                        })),
                    },
                ];
                const dateString = format(new Date(), "yyyyMMdd");
                changeLoaderAndExportToCSV(tabs, `MTM_${dataInfo.preventionDataset}_${dateString}`);
                break;
            }
            case "MOLECULAR_ASSAY": {
                const filters = [
                    filterByDownload(),
                    filterByAssayTypes(["MOLECULAR_ASSAY", "BIOCHEMICAL_ASSAY"]),
                    filterByTypes(MOLECULAR_MECHANISM_TYPES),
                    filterBySpecies(dataInfo.species),
                    filterByCountries(dataInfo.countries),
                    filterByYears(dataInfo.years),
                ];
                const studies = filterStudies(preventionStudies, filters);
                const results = buildResults(studies, mappings[dataInfo.preventionDataset]);
                const fields = [
                    "ID",
                    "COUNTRY_NAME",
                    "ADMIN1",
                    "ADMIN2",
                    "SITE_NAME",
                    "SITE_CODE",
                    "LATITUDE",
                    "LONGITUDE",
                    "TEST_TYPE",
                    "YEAR_START",
                    "VECTOR_SPECIES",
                    "STAGE_ORIGIN",
                    "MOSQUITO_NUMBER",
                    "MECHANISM_STATUS",
                    "MECHANISM_FREQUENCY",
                    "DATA_SOURCE",
                    "CITATION",
                    "CITATION_URL",
                    "DATA_CURATOR",
                ];
                const tabs = [
                    {
                        name: t("disclaimerTab.name"),
                        studies: [
                            {
                                Disclaimer: t("disclaimerTab.disclaimer"),
                            },
                        ],
                    },
                    {
                        name: "Data",
                        studies: results,
                    },
                    {
                        name: "Glossary",
                        studies: fields.map(field => ({
                            "Variable name": field,
                            Description: t(`download.molecular_assay.${field}`),
                        })),
                    },
                ];
                const dateString = format(new Date(), "yyyyMMdd");
                changeLoaderAndExportToCSV(tabs, `MTM_${dataInfo.preventionDataset}_${dateString}`);
                break;
            }
            case "BIOCHEMICAL_ASSAY": {
                const filters = [
                    filterByDownload(),
                    filterByTypes(BIOCHEMICAL_MECHANISM_TYPES),
                    filterBySpecies(dataInfo.species),
                    filterByCountries(dataInfo.countries),
                    filterByYears(dataInfo.years),
                ];
                const studies = filterStudies(preventionStudies, filters);
                const results = buildResults(studies, mappings[dataInfo.preventionDataset]);
                const fields = [
                    "ID",
                    "COUNTRY_NAME",
                    "ADMIN1",
                    "ADMIN2",
                    "SITE_NAME",
                    "SITE_CODE",
                    "LATITUDE",
                    "LONGITUDE",
                    "TEST_TYPE",
                    "YEAR_START",
                    "VECTOR_SPECIES",
                    "STAGE_ORIGIN",
                    "MOSQUITO_NUMBER",
                    "MECHANISM_STATUS",
                    "DATA_SOURCE",
                    "CITATION",
                    "CITATION_URL",
                    "DATA_CURATOR",
                ];
                const tabs = [
                    {
                        name: t("disclaimerTab.name"),
                        studies: [
                            {
                                Disclaimer: t("disclaimerTab.disclaimer"),
                            },
                        ],
                    },
                    {
                        name: "Data",
                        studies: results,
                    },
                    {
                        name: "Glossary",
                        studies: fields.map(field => ({
                            "Variable name": field,
                            Description: t(`download.biochemical_assay.${field}`),
                        })),
                    },
                ];
                const dateString = format(new Date(), "yyyyMMdd");
                changeLoaderAndExportToCSV(tabs, `MTM_${dataInfo.preventionDataset}_${dateString}`);
                break;
            }
        }
    };

    const downloadTreatmentData = () => {
        switch (dataInfo.treatmentDataset) {
            case "THERAPEUTIC_EFFICACY_STUDY": {
                const filters = [
                    filterByDimensionId(256),
                    filterByManyPlasmodiumSpecies(dataInfo.plasmodiumSpecies),
                    filterByDrugs(dataInfo.drugs),
                    filterByCountries(dataInfo.countries),
                    filterByYears(dataInfo.years),
                ];
                const studies = filterStudies(treatmentStudies, filters);
                const results = buildResults(studies, mappings[dataInfo.treatmentDataset]);
                const fields = [
                    "ID",
                    "COUNTRY_NAME",
                    "ADMIN2",
                    "SITE_NAME",
                    "LATITUDE",
                    "LONGITUDE",
                    "YEAR_START",
                    "YEAR_END",
                    "DRUG_NAME",
                    "PLASMODIUM_SPECIES",
                    "SAMPLE_SIZE",
                    "FOLLOW_UP",
                    "POSITIVE_DAY_3",
                    "TREATMENT_FAILURE_PP",
                    "TREATMENT_FAILURE_KM",
                    "DATA_SOURCE",
                    "CITATION_URL",
                ];
                const tabs = [
                    {
                        name: t("disclaimerTab.name"),
                        studies: [
                            {
                                Disclaimer: t("disclaimerTab.disclaimer"),
                            },
                        ],
                    },
                    {
                        name: "Data",
                        studies: results,
                    },
                    {
                        name: "Glossary",
                        studies: fields.map(field => ({
                            "Variable name": field,
                            Description: t(`download.therapeutic_efficacy.${field}`),
                        })),
                    },
                ];
                const dateString = format(new Date(), "yyyyMMdd");
                changeLoaderAndExportToCSV(tabs, `MTM_${dataInfo.treatmentDataset}_${dateString}`);
                break;
            }
            case "MOLECULAR_MARKER_STUDY": {
                const filters = [
                    filterByMolecularMarkerStudyDimension255(),
                    filterByMolecularMarkers(dataInfo.molecularMarkers),
                    filterByCountries(dataInfo.countries),
                    filterByYears(dataInfo.years),
                ];
                const studies = filterStudies(treatmentStudies, filters);
                const results = buildResults(studies, mappings["MOLECULAR_MARKER_STUDY"]);
                const genes = buildResults(
                    R.flatten(R.map(r => r.groupStudies, studies)),
                    mappings["MOLECULAR_MARKER_STUDY_GENES"]
                );
                const fields = [
                    "ID",
                    "MM_TYPE",
                    "COUNTRY_NAME",
                    "SITE_NAME",
                    "ADMIN2",
                    "LATITUDE",
                    "LONGITUDE",
                    "YEAR_START",
                    "DRUG_NAME",
                    "PLASMODIUM_SPECIES",
                    "SAMPLE_SIZE",
                    "DATA_SOURCE",
                    "CITATION_URL",
                    "GENOTYPE",
                    "PROPORTION",
                ];
                const tabs = [
                    {
                        name: t("disclaimerTab.name"),
                        studies: [
                            {
                                Disclaimer: t("disclaimerTab.disclaimer"),
                            },
                        ],
                    },
                    {
                        name: "MM_StudyInfo",
                        studies: results,
                    },
                    {
                        name: "MM_geneMutations",
                        studies: genes,
                    },
                    {
                        name: "Glossary",
                        studies: fields.map(field => ({
                            "Variable name": field,
                            Description: t(`download.mm.${field}`),
                        })),
                    },
                ];
                const dateString = format(new Date(), "yyyyMMdd");
                changeLoaderAndExportToCSV(tabs, `MTM_${dataInfo.treatmentDataset}_${dateString}`);
                break;
            }
        }
    };

    const downloadInvasiveData = () => {
        if (dataInfo.invasiveDataset === "INVASIVE_VECTOR_SPECIES") {
            const filters = [
                filterBySpecies(dataInfo.species),
                filterByCountries(dataInfo.countries),
                filterByYears(dataInfo.years),
            ];
            const studies = filterStudies(invasiveStudies, filters);
            const results = buildResults(studies, mappings[dataInfo.invasiveDataset]);
            const fields = [
                "ID",
                "COUNTRY_NAME",
                "SITE_NAME",
                "LATITUDE",
                "LONGITUDE",
                "VECTOR_SPECIES_COMPLEX",
                "VECTOR_SPECIES",
                "STAGE",
                "YEAR_START",
                "MONTH_START",
                "YEAR_END",
                "MONTH_END",
                "SAMPLING_METHOD",
                "MOSQUITO_NUMBER",
                "BREEDING_HABITAT",
                "ID_METHOD",
                "DATA_SOURCE",
                "CITATION",
                "CITATION_URL",
                "DATA_CURATOR",
                "INVASIVE_STATUS",
            ];
            const tabs = [
                {
                    name: t("disclaimerTab.name"),
                    studies: [
                        {
                            Disclaimer: t("disclaimerTab.disclaimer"),
                        },
                    ],
                },
                {
                    name: "Data",
                    studies: results,
                },
                {
                    name: "Glossary",
                    studies: fields.map(field => ({
                        "Variable name": field,
                        Description: t(`download.invasive.${field}`),
                    })),
                },
            ];
            const dateString = format(new Date(), "yyyyMMdd");
            changeLoaderAndExportToCSV(tabs, `MTM_${dataInfo.invasiveDataset}_${dateString}`);
        }
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
                position: "", // TODO: Remove of backend?
                country: userInfo.country,
                email: userInfo.email,
                researchInfo: useInfo.researchInfo || "",
                policiesInfo: useInfo.policiesInfo || "",
                contactConsent: userInfo.contactConsent,
                organisationProjectConsent: userInfo.piConsent,
                toolsInfo: useInfo.toolsInfo || "",
                implementationCountries: useInfo.countries.join(", ") || "",
                date: useInfo.studyDate.toISOString().slice(0, 10),
                theme: dataInfo.theme,
                dataset: t(
                    `common.${dataInfo.preventionDataset || dataInfo.treatmentDataset || dataInfo.invasiveDataset}`
                ),
            };

            let dataset;
            switch (dataInfo.theme) {
                case "prevention":
                    downloadPreventionData();
                    dataset = dataInfo.preventionDataset;
                    break;
                case "treatment":
                    downloadTreatmentData();
                    dataset = dataInfo.treatmentDataset;
                    break;
                case "invasive":
                    downloadInvasiveData();
                    dataset = dataInfo.invasiveDataset;
                    break;
            }
            addDownload(request);

            logEvent({ category: "Download", action: "download", label: dataset || undefined });
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

    const isUseFormValid = () => {
        if (!useInfo.uses) {
            return false;
        }
        const researchActive = isResearchActive(useInfo.uses);
        const policiesActive = isPoliciesActive(useInfo.uses);
        const toolsActive = isToolsActive(useInfo.uses);
        return (
            useInfo.uses.length > 0 &&
            useInfo.studyDate &&
            (researchActive ? useInfo.researchInfo : true) &&
            (policiesActive ? useInfo.policiesInfo : true) &&
            (toolsActive ? useInfo.toolsInfo : true) &&
            useInfo.countries.length > 0
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
                return <Terms termsInfo={termsInfo} dataInfo={dataInfo} onChange={onChangeWelcomeInfo} />;
            case 3:
                return <UseForm useInfo={useInfo} onChange={onChangeUseInfo} />;
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

    const isFormValid = () => isWelcomeFormValid() && isUserFormValid() && isUseFormValid() && isDownloadFormValid();

    return (
        <StyledContainer maxWidth="xl">
            {downloading && <SimpleLoader message={messageLoader} />}

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

            <Wrapper>{renderStep()}</Wrapper>

            <Container
                maxWidth="xs"
                sx={{ display: "flex", flexDirection: "row", marginTop: 4, justifyContent: "center" }}
            >
                <BackButton
                    variant="outlined"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.button}
                    size="large"
                >
                    {t("common.data_download.buttons.back")}
                </BackButton>
                {activeStep < steps.length - 1 && (
                    <PrimaryButton
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                        className={classes.button}
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
                        className={classes.button}
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
