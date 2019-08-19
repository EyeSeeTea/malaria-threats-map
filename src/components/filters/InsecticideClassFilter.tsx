import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormHelperText from "@material-ui/core/FormHelperText";
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

export default function InsecticideClassFilter() {
  const classes = useStyles({});
  const [value, setValue] = React.useState("female");

  function handleChange(event: React.ChangeEvent<unknown>) {
    setValue((event.target as HTMLInputElement).value);
  }

  return (
    <div className={classes.root}>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Insecticide Class</FormLabel>
        <RadioGroup
          className={classes.group}
          value={value}
          onChange={handleChange}
        >
          <StyledFormControlLabel
            value="female"
            control={<Radio color="primary" />}
            label="Pyrethroids"
          />
          <StyledFormControlLabel
            value="male"
            control={<Radio color="primary" />}
            label="Organochlorines"
          />
          <StyledFormControlLabel
            value="other"
            control={<Radio color="primary" />}
            label="Carbamates"
          />
          <StyledFormControlLabel
            value="disabled"
            control={<Radio color="primary" />}
            label="Organophosphates"
          />
        </RadioGroup>
      </FormControl>
    </div>
  );
}
