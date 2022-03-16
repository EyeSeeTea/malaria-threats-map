import React from "react";
import { AppBar, Toolbar, IconButton, Theme, Typography } from "@mui/material";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import CloseIcon from "@mui/icons-material/Close";
import { State } from "../store/types";
import {
    selectLastUpdatedDates,
    selectTheme,
    selectSelection,
    selectCountryMode,
    selectViewData,
} from "../store/reducers/base-reducer";
import { selectFilteredPreventionStudies } from "../store/reducers/prevention-reducer";
import { selectDiagnosisFilters, selectFilteredDiagnosisStudies } from "../store/reducers/diagnosis-reducer";
import { selectFilteredTreatmentStudies } from "../store/reducers/treatment-reducer";
import { selectFilteredInvasiveStudies, selectInvasiveFilters } from "../store/reducers/invasive-reducer";
import { setFiltersMode, setTooltipOpen } from "../store/actions/base-actions";
import { connect } from "react-redux";

import { useTranslation, Trans } from "react-i18next";

import { DiagnosisStudy } from "../../domain/entities/DiagnosisStudy";
import { InvasiveStudy } from "../../domain/entities/InvasiveStudy";
import { PreventionStudy } from "../../domain/entities/PreventionStudy";
import { TreatmentStudy } from "../../domain/entities/TreatmentStudy";

import InvasiveSelectionChart from "./layers/invasive/InvasiveSelectionChart";
import DiagnosisSelectionChart from "./layers/diagnosis/DiagnosisSelectionChart";
import PreventionSelectionChart from "./layers/prevention/PreventionSelectionChart";
import TreatmentSelectionChart from "./layers/treatment/TreatmentSelectionChart";

//                <i>{t(diagnosisFilters.deletionType).toLowerCase()}</i>

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        appBar: {
            transition: theme.transitions.create(["margin", "width"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
        tab: {
            minWidth: 0,
        },
        title: {
            flexGrow: 1,
        },
        root: {
            width: "100%",
            overflowX: "auto",
            margin: "20px 0",
        },
        table: {
            marginTop: 10,
        },
        head: {
            color: theme.palette.common.white,
            backgroundColor: theme.palette.background.default,
        },
    })
);
const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    filteredPreventionStudies: selectFilteredPreventionStudies(state),
    filteredDiagnosisStudies: selectFilteredDiagnosisStudies(state),
    filteredTreatmentStudies: selectFilteredTreatmentStudies(state),
    filteredInvasiveStudies: selectFilteredInvasiveStudies(state),
    lastUpdatedDates: selectLastUpdatedDates(state),
    selection: selectSelection(state),
    countryMode: selectCountryMode(state),
    diagnosisFilters: selectDiagnosisFilters(state),
    invasiveFilters: selectInvasiveFilters(state),
    viewData: selectViewData(state),
});
const mapDispatchToProps = {
    setTooltipOpen: setTooltipOpen,
    setFiltersMode: setFiltersMode,
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const tabs = ["filters", "regions"];

const StudyDetailsSidebar = ({
    theme,
    filteredPreventionStudies,
    filteredDiagnosisStudies,
    filteredTreatmentStudies,
    filteredInvasiveStudies,
    setTooltipOpen,
    setFiltersMode,
    lastUpdatedDates,
    countryMode,
    selection,
    viewData,
    diagnosisFilters: { mapType: diagnosisMapType },
    invasiveFilters: { mapType: invasiveMapType },
}: Props) => {
    const { t } = useTranslation();
    const classes = useStyles({});

    const filteredStudies = (() => {
        switch (theme) {
            case "prevention":
                return filteredPreventionStudies;
            case "diagnosis":
                return filteredDiagnosisStudies;
            case "treatment":
                return filteredTreatmentStudies;
            case "invasive":
                return filteredInvasiveStudies;
            default:
                return [];
        }
    })();
    const [filteredStudiesDiagnosis, setFilteredStudiesDiagnosis] = React.useState<Array<DiagnosisStudy>>([]);
    const [filteredStudiesInvasives, setFilteredStudiesInvasive] = React.useState<Array<InvasiveStudy>>([]);
    const [filteredStudiesPrevention, setFilteredStudiesPrevention] = React.useState<Array<PreventionStudy>>([]);
    const [filteredStudiesTreatment, setFilteredStudiesTreatment] = React.useState<Array<TreatmentStudy>>([]);

    React.useEffect(() => {
        console.log(selection);
        console.log(viewData);
        const diagnosis =
            viewData !== undefined &&
            filteredDiagnosisStudies !== null &&
            filteredDiagnosisStudies.filter((study: DiagnosisStudy) =>
                countryMode ? study.ISO2 === viewData.ISO_2_CODE : study.SITE_ID === viewData.SITE_ID
            );
        setFilteredStudiesDiagnosis(diagnosis);
    }, [viewData]);

    React.useEffect(() => {
        const invasive =
            viewData !== undefined &&
            filteredInvasiveStudies !== null &&
            filteredInvasiveStudies.filter((study: InvasiveStudy) =>
                countryMode ? study.ISO2 === viewData.ISO_2_CODE : study.SITE_ID === viewData.SITE_ID
            );
        setFilteredStudiesInvasive(invasive);
    }, [viewData]);

    React.useEffect(() => {
        const treatment =
            viewData !== undefined &&
            filteredTreatmentStudies !== null &&
            filteredTreatmentStudies.filter((study: TreatmentStudy) =>
                countryMode ? study.ISO2 === viewData.ISO_2_CODE : study.SITE_ID === viewData.SITE_ID
            );
        setFilteredStudiesTreatment(treatment);
    }, [viewData]);

    React.useEffect(() => {
        const prevention =
            viewData !== undefined &&
            filteredPreventionStudies !== null &&
            filteredPreventionStudies.filter((study: PreventionStudy) =>
                countryMode ? study.ISO2 === viewData.ISO_2_CODE : study.SITE_ID === viewData.SITE_ID
            );
        setFilteredStudiesPrevention(prevention);
    }, [viewData]);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setFiltersMode(tabs[newValue]);
    };

    const handleClose = () => {
        setTooltipOpen(false);
    };

    const themeSelector = theme as "prevention" | "diagnosis" | "treatment" | "invasive";

    if (
        !filteredStudiesDiagnosis.length &&
        !filteredStudiesInvasives.length &&
        !filteredStudiesPrevention.length &&
        !filteredStudiesTreatment.length
    ) {
        return <div />;
    }

    console.log(filteredStudiesDiagnosis);
    console.log(filteredStudiesInvasives);
    console.log(filteredStudiesPrevention);
    console.log(filteredStudiesTreatment);

    return (
        <div id="sidebar">
            <AppBar position="static" className={classes.appBar}>
                <Toolbar variant="dense">
                    <Typography variant="subtitle1" className={classes.title}>
                        {t(`common.themes.${theme}`)}
                    </Typography>
                    <IconButton edge="start" color="inherit" onClick={handleClose} size={"small"} aria-label="close">
                        <CloseIcon fontSize={"small"} />
                    </IconButton>
                </Toolbar>
            </AppBar>
            {themeSelector === "diagnosis" && <DiagnosisSelectionChart studies={filteredStudiesDiagnosis} />}

            {themeSelector === "invasive" && <InvasiveSelectionChart studies={filteredStudiesInvasives} />}

            {themeSelector === "prevention" && <PreventionSelectionChart studies={filteredStudiesPrevention} />}
            {themeSelector === "treatment" && <TreatmentSelectionChart studies={filteredStudiesTreatment} />}
        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(StudyDetailsSidebar);
