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
  Typography,
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepButton from "@material-ui/core/StepButton";
import { selectIsDataDownloadOpen } from "../../store/reducers/base-reducer";
import {
  logEventAction,
  setDataDownloadOpenAction,
} from "../../store/actions/base-actions";
import { useTranslation } from "react-i18next";
import { selectTreatmentStudies } from "../../store/reducers/treatment-reducer";
import UserForm, { ORGANIZATION_TYPES } from "./UserForm";
import UseForm, {
  isPoliciesActive,
  isResearchActive,
  isToolsActive,
} from "./UseForm";
import Welcome from "./Welcome";
import Filters from "./Filters";
import { exportToCSV } from "./download";
import { FlexGrow } from "../Chart";
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
import {
  englishDisclaimerTab,
  frenchDisclaimerTab,
  spanishDisclaimerTab,
} from "./utils";
import i18next from "i18next";

export const MOLECULAR_MECHANISM_TYPES = [
  "MONO_OXYGENASES",
  "ESTERASES",
  "GSTS",
];

export const BIOCHEMICAL_MECHANISM_TYPES = [
  "KDR_L1014S",
  "KDR_L1014F",
  "KDR_(MUTATION_UNSPECIFIED)",
  "ACE1R",
];

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
    paper: {
      backgroundColor: "#fafafa",
    },
  })
);

const mapStateToProps = (state: State) => ({
  isDataDownloadOpen: selectIsDataDownloadOpen(state),
  preventionStudies: selectPreventionStudies(state),
  treatmentStudies: selectTreatmentStudies(state),
  invasiveStudies: selectInvasiveStudies(state),
});

const mapDispatchToProps = {
  setDataDownloadOpen: setDataDownloadOpenAction,
  addDownload: addDataDownloadRequestAction,
  logEvent: logEventAction,
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
    "data_download.step3.title",
  ];
}

export type UserInfo = {
  firstName: string;
  lastName: string;
  organizationType: string;
  organizationName: string;
  position: string;
  country: string;
  email: string;
  phoneNumber: string;
};

export type WelcomeInfo = {
  agreement: boolean;
};

export type UseInfo = {
  uses: string[];
  countries: string[];
  studyDate: Date;
  researchInfo: string;
  policiesInfo: string;
  toolsInfo: string;
  contactConsent: boolean;
  piConsent: boolean;
};

export type Download = {
  firstName: string;
  lastName: string;
  organizationType: string;
  organizationName: string;
  position: string;
  country: string;
  email: string;
  phoneNumber: string;
  uses: string;
  date: string;
  researchInfo: string;
  policiesInfo: string;
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
function DataDownload({
  isDataDownloadOpen,
  setDataDownloadOpen,
  preventionStudies,
  treatmentStudies,
  invasiveStudies,
  logEvent,
  addDownload,
}: Props) {
  const classes = useStyles({});
  const { t } = useTranslation("common");
  const { t: d } = useTranslation("download");
  const [activeStep, setActiveStep] = React.useState(0);

  const [welcomeInfo, setWelcomeInfo] = React.useState<Partial<WelcomeInfo>>(
    {}
  );
  const [userInfo, setUserInfo] = React.useState<Partial<UserInfo>>({
    organizationType: t(ORGANIZATION_TYPES[0]),
  });
  const [useInfo, setUseInfo] = React.useState<Partial<UseInfo>>({
    uses: [],
    countries: [],
    studyDate: new Date(),
  });

  const [selections, setSelections] = React.useState({
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

  const reset = () => {
    setActiveStep(0);
    setWelcomeInfo({});
    setUserInfo({
      organizationType: t(ORGANIZATION_TYPES[0]),
    });
    setUseInfo({
      uses: [],
      countries: [],
      studyDate: new Date(),
    });
    setSelections({
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
  };

  const onChangeWelcomeInfo = (field: keyof WelcomeInfo, value: any) => {
    setWelcomeInfo({ ...welcomeInfo, [field]: value });
  };
  const onChangeUserInfo = (field: keyof UserInfo, value: any) => {
    setUserInfo({ ...userInfo, [field]: value });
  };
  const onChangeUseInfo = (field: keyof UseInfo, value: any) => {
    setUseInfo({ ...useInfo, [field]: value });
  };
  const handleToggle = () => {
    setDataDownloadOpen(!isDataDownloadOpen);
    reset();
  };

  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const filterStudies = (baseStudies: any[], filters: any[]) => {
    return filters.reduce(
      (studies, filter) => studies.filter(filter),
      baseStudies
    );
  };

  const resolveValue = (field: Option, study: any) => {
    if (field.value === "MM_TYPE") {
      return MOLECULAR_MARKERS.find(
        (mm) => mm.value === Number(study[field.value])
      ).label;
    }
    if (field.value === "PLASMODIUM_SPECIES") {
      return PLASMODIUM_SPECIES_SUGGESTIONS.find(
        (species) => species.value === study[field.value]
      ).label;
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
        return t(
          study[field.value] === "NA" ? "COUNTRY_NA" : study[field.value]
        );
      }
    }
    if (!isNaN(study[field.value])) {
      return study[field.value];
    } else {
      return t(study[field.value]);
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

  const getDisclaimerTab = () => {
    const language = i18next.language || window.localStorage.i18nextLng;
    switch (language) {
      case "fr":
        return frenchDisclaimerTab;
      case "es":
        return spanishDisclaimerTab;
      default:
        return englishDisclaimerTab;
    }
  };

  const downloadPreventionData = () => {
    switch (selections.preventionDataset) {
      case "DISCRIMINATING_CONCENTRATION_BIOASSAY":
      case "INTENSITY_CONCENTRATION_BIOASSAY": {
        const filters = [
          filterByDownload(),
          filterByAssayTypes([selections.preventionDataset]),
          filterByInsecticideClasses(selections.insecticideClasses),
          filterByInsecticideTypes(selections.insecticideTypes),
          filterByTypes(selections.types),
          filterBySpecies(selections.species),
          filterByCountries(selections.countries),
          filterByYears(selections.years),
        ];
        const studies = filterStudies(preventionStudies, filters);
        const results = buildResults(
          studies,
          mappings[selections.preventionDataset]
        );

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
          getDisclaimerTab(),
          {
            name: "Data",
            studies: results,
          },
          {
            name: "Glossary",
            studies: fields.map((field) => ({
              "Variable name": field,
              Description: d(`discrimination.${field}`),
            })),
          },
        ];
        const dateString = format(new Date(), "yyyyMMdd");
        exportToCSV(tabs, `MTM_${selections.preventionDataset}_${dateString}`);
        break;
      }
      case "SYNERGIST-INSECTICIDE_BIOASSAY": {
        const filters = [
          filterByDownload(),
          filterByAssayTypes([selections.preventionDataset]),
          filterByTypes(selections.types),
          filterBySpecies(selections.species),
          filterByCountries(selections.countries),
          filterByYears(selections.years),
        ];
        const studies = filterStudies(preventionStudies, filters);
        const results = buildResults(
          studies,
          mappings[selections.preventionDataset]
        );
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
          getDisclaimerTab(),
          {
            name: "Data",
            studies: results,
          },
          {
            name: "Glossary",
            studies: fields.map((field) => ({
              "Variable name": field,
              Description: d(`synergist.${field}`),
            })),
          },
        ];
        const dateString = format(new Date(), "yyyyMMdd");
        exportToCSV(tabs, `MTM_${selections.preventionDataset}_${dateString}`);
        break;
      }
      case "MOLECULAR_ASSAY": {
        const filters = [
          filterByDownload(),
          filterByAssayTypes(["MOLECULAR_ASSAY", "BIOCHEMICAL_ASSAY"]),
          filterByTypes(MOLECULAR_MECHANISM_TYPES),
          filterBySpecies(selections.species),
          filterByCountries(selections.countries),
          filterByYears(selections.years),
        ];
        const studies = filterStudies(preventionStudies, filters);
        const results = buildResults(
          studies,
          mappings[selections.preventionDataset]
        );
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
          getDisclaimerTab(),
          {
            name: "Data",
            studies: results,
          },
          {
            name: "Glossary",
            studies: fields.map((field) => ({
              "Variable name": field,
              Description: d(`molecular_assay.${field}`),
            })),
          },
        ];
        const dateString = format(new Date(), "yyyyMMdd");
        exportToCSV(tabs, `MTM_${selections.preventionDataset}_${dateString}`);
        break;
      }
      case "BIOCHEMICAL_ASSAY": {
        const filters = [
          filterByDownload(),
          filterByTypes(BIOCHEMICAL_MECHANISM_TYPES),
          filterBySpecies(selections.species),
          filterByCountries(selections.countries),
          filterByYears(selections.years),
        ];
        const studies = filterStudies(preventionStudies, filters);
        const results = buildResults(
          studies,
          mappings[selections.preventionDataset]
        );
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
          getDisclaimerTab(),
          {
            name: "Data",
            studies: results,
          },
          {
            name: "Glossary",
            studies: fields.map((field) => ({
              "Variable name": field,
              Description: d(`biochemical_assay.${field}`),
            })),
          },
        ];
        const dateString = format(new Date(), "yyyyMMdd");
        exportToCSV(tabs, `MTM_${selections.preventionDataset}_${dateString}`);
        break;
      }
    }
  };

  const downloadTreatmentData = () => {
    switch (selections.treatmentDataset) {
      case "THERAPEUTIC_EFFICACY_STUDY": {
        const filters = [
          filterByDimensionId(256),
          filterByManyPlasmodiumSpecies(selections.plasmodiumSpecies),
          filterByDrugs(selections.drugs),
          filterByCountries(selections.countries),
          filterByYears(selections.years),
        ];
        const studies = filterStudies(treatmentStudies, filters);
        const results = buildResults(
          studies,
          mappings[selections.treatmentDataset]
        );
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
          getDisclaimerTab(),
          {
            name: "Data",
            studies: results,
          },
          {
            name: "Glossary",
            studies: fields.map((field) => ({
              "Variable name": field,
              Description: d(`therapeutic_efficacy.${field}`),
            })),
          },
        ];
        const dateString = format(new Date(), "yyyyMMdd");
        exportToCSV(tabs, `MTM_${selections.treatmentDataset}_${dateString}`);
        break;
      }
      case "MOLECULAR_MARKER_STUDY": {
        const filters = [
          filterByMolecularMarkerStudyDimension255(),
          filterByMolecularMarkers(selections.molecularMarkers),
          filterByCountries(selections.countries),
          filterByYears(selections.years),
        ];
        const studies = filterStudies(treatmentStudies, filters);
        const results = buildResults(
          studies,
          mappings["MOLECULAR_MARKER_STUDY"]
        );
        const genes = buildResults(
          R.flatten(R.map((r) => r.groupStudies, studies)),
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
          getDisclaimerTab(),
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
            studies: fields.map((field) => ({
              "Variable name": field,
              Description: d(`mm.${field}`),
            })),
          },
        ];
        const dateString = format(new Date(), "yyyyMMdd");
        exportToCSV(tabs, `MTM_${selections.treatmentDataset}_${dateString}`);
        break;
      }
    }
  };

  const downloadInvasiveData = () => {
    if (selections.invasiveDataset === "INVASIVE_VECTOR_SPECIES") {
      {
        const filters = [
          filterBySpecies(selections.species),
          filterByCountries(selections.countries),
          filterByYears(selections.years),
        ];
        const studies = filterStudies(invasiveStudies, filters);
        const results = buildResults(
          studies,
          mappings[selections.invasiveDataset]
        );
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
          getDisclaimerTab(),
          {
            name: "Data",
            studies: results,
          },
          {
            name: "Glossary",
            studies: fields.map((field) => ({
              "Variable name": field,
              Description: d(`invasive.${field}`),
            })),
          },
        ];
        const dateString = format(new Date(), "yyyyMMdd");
        exportToCSV(tabs, `MTM_${selections.invasiveDataset}_${dateString}`);
      }
    }
  };

  const downloadData = () => {
    const request: Download = {
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      organizationType: t(userInfo.organizationType),
      organizationName: userInfo.organizationName,
      position: userInfo.position,
      country: userInfo.country,
      email: userInfo.email,
      phoneNumber: userInfo.phoneNumber,
      uses: useInfo.uses.map((use) => t(use)).join(", "),
      researchInfo: useInfo.researchInfo || "",
      policiesInfo: useInfo.policiesInfo || "",
      toolsInfo: useInfo.toolsInfo || "",
      implementationCountries: useInfo.countries.join(", ") || "",
      date: useInfo.studyDate.toISOString().slice(0, 10),
      theme: selections.theme,
      dataset: t(
        selections.preventionDataset ||
          selections.treatmentDataset ||
          selections.invasiveDataset
      ),
    };
    switch (selections.theme) {
      case "prevention":
        downloadPreventionData();
        break;
      case "treatment":
        downloadTreatmentData();
        break;
      case "invasive":
        downloadInvasiveData();
        break;
    }
    addDownload(request);
    logEvent({
      category: "Download Data",
      action: selections.theme,
    });
  };

  const isWelcomeFormValid = () => {
    return welcomeInfo.agreement;
  };

  const isUserFormValid = () => {
    return (
      userInfo.firstName &&
      userInfo.lastName &&
      userInfo.position &&
      userInfo.country &&
      userInfo.organizationType &&
      userInfo.organizationName &&
      userInfo.email
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
      (toolsActive ? useInfo.toolsInfo : true)
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
        return (
          <Welcome welcomeInfo={welcomeInfo} onChange={onChangeWelcomeInfo} />
        );
      case 1:
        return <UserForm userInfo={userInfo} onChange={onChangeUserInfo} />;
      case 2:
        return <UseForm useInfo={useInfo} onChange={onChangeUseInfo} />;
      case 3:
        return <Filters onChange={setSelections} selections={selections} />;
      default:
        return <div />;
    }
  };

  const {
    theme,
    preventionDataset,
    treatmentDataset,
    invasiveDataset,
  } = selections;

  const isStepValid = () => {
    switch (activeStep) {
      case 0:
        return isWelcomeFormValid();
      case 1:
        return isWelcomeFormValid() && isUserFormValid();
      case 2:
        return isWelcomeFormValid() && isUserFormValid() && isUseFormValid();
    }
  };

  const isFormValid = () =>
    isWelcomeFormValid() &&
    isUserFormValid() &&
    isUseFormValid() &&
    isDownloadFormValid();

  return (
    <div>
      <Fab
        size="small"
        color={isDataDownloadOpen ? "primary" : "default"}
        onClick={handleToggle}
        className={classes.fab}
        title={t("icons.download")}
      >
        <CloudDownloadIcon />
      </Fab>
      <Dialog
        fullScreen
        open={isDataDownloadOpen}
        onClose={handleToggle}
        aria-labelledby="max-width-dialog-title"
        PaperProps={{
          className: classes.paper,
        }}
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
          <Stepper
            alternativeLabel
            nonLinear
            activeStep={activeStep}
            className={classes.paper}
          >
            {steps.map((label, index) => (
              <Step key={label}>
                <StepButton>{t(label)}</StepButton>
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
              disabled={!isStepValid()}
            >
              {t("data_download.buttons.next")}
            </Button>
            <Button
              startIcon={<CloudDownloadIcon />}
              variant={"contained"}
              color={"primary"}
              disabled={!isFormValid()}
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

export default connect(mapStateToProps, mapDispatchToProps)(DataDownload);
