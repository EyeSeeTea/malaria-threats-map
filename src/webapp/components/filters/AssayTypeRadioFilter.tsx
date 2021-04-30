import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import styled from "styled-components";

const StyledFormControlLabel = styled(FormControlLabel)`
  & span {
    padding: 2px;
  }
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex"
    },
    formControl: {
      margin: theme.spacing(3)
    },
    group: {
      margin: theme.spacing(1, 0)
    },
    radio: {
      padding: theme.spacing(0.5, 0)
    }
  })
);

export default function AssayTypeRadioFilter() {
  const classes = useStyles({});
  const [value, setValue] = React.useState("female");

  function handleChange(event: React.ChangeEvent<unknown>) {
    setValue((event.target as HTMLInputElement).value);
  }

  return (
    <div className={classes.root}>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Assay Type</FormLabel>
        <RadioGroup
          className={classes.group}
          value={value}
          onChange={handleChange}
        >
          <StyledFormControlLabel
            value="female"
            control={<Radio color="primary" />}
            label="Discriminating concentration bioassay"
          />
          <StyledFormControlLabel
            value="male"
            control={<Radio color="primary" />}
            label="Intensity concentration bioassay"
          />
        </RadioGroup>
      </FormControl>
    </div>
  );
}
