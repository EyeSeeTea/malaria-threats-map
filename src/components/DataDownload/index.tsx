import React from "react";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { State } from "../../store/types";
import { connect } from "react-redux";
import {
  Button,
  createStyles,
  DialogActions,
  Fab,
  makeStyles,
  Theme
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepButton from "@material-ui/core/StepButton";
import { selectIsDataDownloadOpen } from "../../store/reducers/base-reducer";
import { setDataDownloadOpenAction } from "../../store/actions/base-actions";
import { useTranslation } from "react-i18next";
import { selectFilteredTreatmentStudies } from "../../store/reducers/treatment-reducer";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import * as R from "ramda";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      pointerEvents: "all",
      margin: theme.spacing(0.5, 0)
    },
    form: {
      display: "flex",
      flexDirection: "column",
      margin: "auto",
      width: "fit-content"
    },
    formControl: {
      marginTop: theme.spacing(2),
      minWidth: 120
    },
    formControlLabel: {
      marginTop: theme.spacing(1)
    }
  })
);

const mapStateToProps = (state: State) => ({
  isDataDownloadOpen: selectIsDataDownloadOpen(state),
  studies: selectFilteredTreatmentStudies(state)
});

const mapDispatchToProps = {
  setDataDownloadOpen: setDataDownloadOpenAction
};
type OwnProps = {};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps & OwnProps;

function getSteps() {
  return [
    "data_download.step1.title",
    "data_download.step2.title",
    "data_download.step3.title"
  ];
}

function Index({ isDataDownloadOpen, setDataDownloadOpen, studies }: Props) {
  const classes = useStyles({});
  const { t } = useTranslation("common");
  const handleToggle = () => {
    setDataDownloadOpen(!isDataDownloadOpen);
  };
  const steps = getSteps();

  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToCSV = (csvData: any[], fileName: string) => {
    const primary = XLSX.utils.json_to_sheet(studies);
    const molecular = XLSX.utils.json_to_sheet(
      R.flatten(studies.map(s => s.groupStudies))
    );
    const wb = {
      Sheets: { K13: primary, Molecular: molecular },
      SheetNames: ["K13", "Molecular"]
    };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  return (
    <div>
      <Fab
        size="small"
        color={isDataDownloadOpen ? "primary" : "default"}
        onClick={handleToggle}
        className={classes.fab}
        title={t("data_download.title")}
      >
        <CloudDownloadIcon />
      </Fab>
      <Dialog
        fullWidth={true}
        maxWidth={"md"}
        open={isDataDownloadOpen}
        onClose={handleToggle}
        aria-labelledby="max-width-dialog-title"
      >
        <DialogContent>
          <Stepper alternativeLabel nonLinear activeStep={0}>
            {steps.map((label, index) => {
              const stepProps = {};
              const buttonProps = {};
              return (
                <Step key={label} {...stepProps}>
                  <StepButton {...buttonProps}>{t(label)}</StepButton>
                </Step>
              );
            })}
          </Stepper>
        </DialogContent>
        <DialogActions>
          <Button
            startIcon={<CloudDownloadIcon />}
            variant={"contained"}
            color={"primary"}
            onClick={() => exportToCSV([], "file")}
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);
