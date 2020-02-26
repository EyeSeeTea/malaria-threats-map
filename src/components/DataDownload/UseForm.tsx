import React from "react";
import {Card, Checkbox, createStyles, FormControl, makeStyles, Paper, TextField, Theme} from "@material-ui/core";
import styled from "styled-components";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {useTranslation} from "react-i18next";
import FormLabel from "@material-ui/core/FormLabel";
import {Divider} from "../filters/Filters";
import * as R from "ramda";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";

const StyledFormControlLabel = styled(FormControlLabel)`
  & span {
    padding: 2px;
  }
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1, 0)
    },
    paper: {
      padding: "24px"
    }
  })
);
const Snackbar = styled(Paper)`
  margin: 16px 0;
  padding: 16px;
`;

const USES = [
  "data_download.step2.data_use_options.research",
  "data_download.step2.data_use_options.grant",
  "data_download.step2.data_use_options.treatments",
  "data_download.step2.data_use_options.vector",
  "data_download.step2.data_use_options.diagnosis",
  "data_download.step2.data_use_options.policies",
  "data_download.step2.data_use_options.advocacy"
];

const UseForm = () => {
  const classes = useStyles({});
  const { t } = useTranslation("common");
  const [uses, selectUses] = React.useState([]);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(
    new Date()
  );

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };
  return (
    <Card className={classes.paper}>
      <FormControl fullWidth className={classes.formControl}>
        <FormLabel component="legend">
          {t(`data_download.step2.data_use`)}
        </FormLabel>
        <Divider />
        {USES.map(use => (
          <StyledFormControlLabel
            key={use}
            control={
              <Checkbox
                color="primary"
                checked={uses.includes(use)}
                onChange={() =>
                  selectUses(
                    uses.includes(use)
                      ? uses.filter(u => u !== use)
                      : [...uses, use]
                  )
                }
              />
            }
            label={t(use)}
          />
        ))}
      </FormControl>
      {R.any(
        use =>
          [
            "data_download.step2.data_use_options.research",
            "data_download.step2.data_use_options.grant"
          ].includes(use),
        uses
      ) && (
        <FormControl fullWidth className={classes.formControl}>
          <TextField
            label={t(`data_download.step2.date_use_options_content.research`)}
            multiline
            rowsMax="3"
            InputLabelProps={{
              shrink: true
            }}
          />
        </FormControl>
      )}
      {R.any(
        use => ["data_download.step2.data_use_options.policies"].includes(use),
        uses
      ) && (
        <FormControl fullWidth className={classes.formControl}>
          <TextField
            label={t(`data_download.step2.date_use_options_content.policies`)}
            multiline
            rowsMax="3"
            InputLabelProps={{
              shrink: true
            }}
          />
        </FormControl>
      )}
      {R.any(
        use =>
          [
            "data_download.step2.data_use_options.vector",
            "data_download.step2.data_use_options.diagnosis"
          ].includes(use),
        uses
      ) && (
        <FormControl fullWidth className={classes.formControl}>
          <TextField
            label={t(`data_download.step2.date_use_options_content.policies`)}
            multiline
            rowsMax="3"
            InputLabelProps={{
              shrink: true
            }}
          />
        </FormControl>
      )}
      <FormControl fullWidth className={classes.formControl}>
        <FormLabel component="legend">
          {t(`data_download.step2.date_use_options_content.date`)}
        </FormLabel>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            value={selectedDate}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              "aria-label": "change date"
            }}
          />
        </MuiPickersUtilsProvider>
      </FormControl>
      <Snackbar>{t(`data_download.step2.message`)}</Snackbar>
    </Card>
  );
};

export default UseForm;
