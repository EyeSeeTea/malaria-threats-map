import React from "react";
import { Fab, Theme } from "@mui/material";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import ReportIcon from "@mui/icons-material/Description";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { State } from "../../store/types";
import { selectIsReportOpen, selectTheme } from "../../store/reducers/base-reducer";
import { setReportOpenAction } from "../../store/actions/base-actions";
import { connect } from "react-redux";
import PreventionReport from "./prevention/PreventionReport";
import TreatmentReport from "./treatment/TreatmentReport";
import { useTranslation } from "react-i18next";
import { sendAnalytics } from "../../utils/analytics";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
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
        paper: {
            backgroundColor: "#fafafa",
        },
        content: {
            padding: "0 !important",
        },
    })
);

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    isReportOpen: selectIsReportOpen(state),
});
const mapDispatchToProps = {
    openReport: setReportOpenAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = StateProps & DispatchProps;

function Report({ isReportOpen, openReport, theme }: Props) {
    const classes = useStyles({});
    const { t } = useTranslation();

    const handleClickOpen = () => {
        sendAnalytics({ type: "event", category: "menu", action: "summary" });
        openReport(true);
    };

    const handleClose = () => {
        openReport(false);
    };

    const renderReport = () => {
        switch (theme) {
            case "prevention":
                return <PreventionReport />;
            case "treatment":
                return <TreatmentReport />;
            default:
                openReport(false);
        }
    };

    return (
        <React.Fragment>
            <Fab
                id="country-button"
                size="small"
                color={isReportOpen ? "primary" : "default"}
                onClick={handleClickOpen}
                className={classes.fab}
                title={t("common.icons.summary")}
            >
                <ReportIcon />
            </Fab>
            <Dialog
                fullWidth
                maxWidth={"xl"}
                open={isReportOpen}
                onClose={handleClose}
                aria-labelledby="max-width-dialog-title"
            >
                <DialogContent className={classes.content}>{renderReport()}</DialogContent>
            </Dialog>
        </React.Fragment>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Report);
