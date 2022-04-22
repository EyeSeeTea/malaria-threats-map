import React from "react";
import { AppBar, Toolbar, IconButton, Theme, Typography } from "@mui/material";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import CloseIcon from "@mui/icons-material/Close";
import { State } from "../store/types";
import { selectTheme, selectSelection, selectViewData } from "../store/reducers/base-reducer";
import { selectPreventionStudySelection } from "../store/reducers/prevention-reducer";
import { selectDiagnosisStudySelection } from "../store/reducers/diagnosis-reducer";
import { selectTreatmentStudySelection } from "../store/reducers/treatment-reducer";
import { selectInvasiveStudySelection } from "../store/reducers/invasive-reducer";
import { setSidebarOpen, setSelection, setViewData } from "../store/actions/base-actions";
import { connect } from "react-redux";

import { useTranslation } from "react-i18next";
import { DiagnosisStudy } from "../../domain/entities/DiagnosisStudy";
import { InvasiveStudy } from "../../domain/entities/InvasiveStudy";
import { PreventionStudy } from "../../domain/entities/PreventionStudy";
import { TreatmentStudy } from "../../domain/entities/TreatmentStudy";

import InvasiveSelectionChart from "./layers/invasive/InvasiveSelectionChart";
import DiagnosisSelectionChart from "./layers/diagnosis/DiagnosisSelectionChart";
import PreventionSelectionChart from "./layers/prevention/PreventionSelectionChart";
import TreatmentSelectionChart from "./layers/treatment/TreatmentSelectionChart";

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
    preventionStudySelection: selectPreventionStudySelection(state),
    diagnosisStudySelection: selectDiagnosisStudySelection(state),
    treatmentStudySelection: selectTreatmentStudySelection(state),
    invasiveStudySelection: selectInvasiveStudySelection(state),
    selection: selectSelection(state),
    viewData: selectViewData(state),
});
const mapDispatchToProps = {
    setSidebarOpen: setSidebarOpen,
    setSelection: setSelection,
    setViewData: setViewData,
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const StudyDetailsSidebar = ({
    theme,
    setSidebarOpen,
    preventionStudySelection,
    diagnosisStudySelection,
    treatmentStudySelection,
    invasiveStudySelection,
    viewData,
    setViewData,
    setSelection,
}: Props) => {
    const { t } = useTranslation();
    const classes = useStyles({});
    const [filteredStudiesDiagnosis, setFilteredStudiesDiagnosis] = React.useState<Array<DiagnosisStudy>>([]);
    const [filteredStudiesInvasives, setFilteredStudiesInvasive] = React.useState<Array<InvasiveStudy>>([]);
    const [filteredStudiesPrevention, setFilteredStudiesPrevention] = React.useState<Array<PreventionStudy>>([]);
    const [filteredStudiesTreatment, setFilteredStudiesTreatment] = React.useState<Array<TreatmentStudy>>([]);

    React.useEffect(
        () => {
            //I only update the new studies to be shown when viewData changes (ie. when you click on a study circle)
            //so that the data doesn't change automatically when the user hovers over another popup
            switch (theme) {
                case "prevention":
                    setFilteredStudiesPrevention(preventionStudySelection);
                    break;
                case "diagnosis":
                    setFilteredStudiesDiagnosis(diagnosisStudySelection);
                    break;
                case "treatment":
                    setFilteredStudiesTreatment(treatmentStudySelection);
                    break;
                case "invasive":
                    setFilteredStudiesInvasive(invasiveStudySelection);
                    break;
            }
            //only having viewData be in the useEffect is necessary because we don't want to set the studies whenever the selection changes,
            //only when we click on the dot/viewData changes
        },
        // eslint-disable-next-line
        [viewData]
    );

    const handleClose = () => {
        setSidebarOpen(false);
        setSelection(null);
        setViewData(null);
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
