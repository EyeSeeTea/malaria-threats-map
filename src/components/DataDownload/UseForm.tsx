import React from "react";
import {
  Card,
  Checkbox,
  createStyles,
  FormControl,
  makeStyles,
  Paper,
  TextField,
  Theme
} from "@material-ui/core";
import styled from "styled-components";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { useTranslation } from "react-i18next";
import FormLabel from "@material-ui/core/FormLabel";
import { Divider } from "../filters/Filters";
import * as R from "ramda";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import { connect } from "react-redux";
import { UseInfo } from "./index";
import CountriesSelector from "./filters/CountriesSelector";

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
      padding: "24px",
      overflow: "unset"
    },
    countries: {
      margin: 0
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

export const isResearchActive = (uses: string[]) =>
  R.any(
    use =>
      [
        "data_download.step2.data_use_options.research",
        "data_download.step2.data_use_options.grant"
      ].includes(use),
    uses
  );

export const isPoliciesActive = (uses: string[]) =>
  R.any(
    use => ["data_download.step2.data_use_options.policies"].includes(use),
    uses
  );

export const isToolsActive = (uses: string[]) =>
  R.any(
    use =>
      [
        "data_download.step2.data_use_options.vector",
        "data_download.step2.data_use_options.diagnosis"
      ].includes(use),
    uses
  );

const mapDispatchToProps = {};
type OwnProps = {
  useInfo: Partial<UseInfo>;
  onChange: (key: keyof UseInfo, value: any) => void;
};
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & OwnProps;

const UseForm = ({ onChange, useInfo }: Props) => {
  const classes = useStyles({});
  const { t } = useTranslation("common");

  const handleUsesChange = (uses: string[]) => {
    onChange("uses", uses);
  };

  const handleCountriesChange = (countries: string[]) => {
    onChange("countries", countries);
  };

  const handleDateChange = (date: Date | null) => {
    onChange("studyDate", date);
  };

  const researchActive = isResearchActive(useInfo.uses);
  const policiesActive = isPoliciesActive(useInfo.uses);
  const toolsActive = isToolsActive(useInfo.uses);

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
                checked={useInfo.uses.includes(use)}
                onChange={() =>
                  handleUsesChange(
                    useInfo.uses.includes(use)
                      ? useInfo.uses.filter(u => u !== use)
                      : [...useInfo.uses, use]
                  )
                }
              />
            }
            label={t(use)}
          />
        ))}
      </FormControl>
      {researchActive && (
        <FormControl fullWidth className={classes.formControl}>
          <TextField
            label={t(`data_download.step2.date_use_options_content.research`)}
            multiline
            rowsMax="3"
            InputLabelProps={{
              shrink: true
            }}
            value={useInfo.researchInfo}
            onChange={event =>
              onChange("researchInfo", event.target.value as string)
            }
          />
        </FormControl>
      )}
      {policiesActive && (
        <FormControl fullWidth className={classes.formControl}>
          <TextField
            label={t(`data_download.step2.date_use_options_content.policies`)}
            multiline
            rowsMax="3"
            InputLabelProps={{
              shrink: true
            }}
            value={useInfo.policiesInfo}
            onChange={event =>
              onChange("policiesInfo", event.target.value as string)
            }
          />
        </FormControl>
      )}
      {toolsActive && (
        <FormControl fullWidth className={classes.formControl}>
          <TextField
            label={t(`data_download.step2.date_use_options_content.tools`)}
            multiline
            rowsMax="3"
            InputLabelProps={{
              shrink: true
            }}
            value={useInfo.toolsInfo}
            onChange={event =>
              onChange("toolsInfo", event.target.value as string)
            }
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
            value={useInfo.studyDate}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              "aria-label": "change date"
            }}
          />
        </MuiPickersUtilsProvider>
      </FormControl>
      <CountriesSelector
        label={t(`data_download.step2.countries`)}
        className={classes.countries}
        value={useInfo.countries}
        onChange={handleCountriesChange}
      />
      <Snackbar>{t(`data_download.step2.message`)}</Snackbar>
    </Card>
  );
};

export default connect(null, mapDispatchToProps)(UseForm);
