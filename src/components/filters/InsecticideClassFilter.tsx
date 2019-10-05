import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import styled from "styled-components";
import { State } from "../../store/types";
import { selectRegion } from "../../malaria/reducer";
import { selectCountryLayer } from "../../store/reducers/country-layer-reducer";
import {
  selectCountries,
  selectInsecticideClasses
} from "../../malaria/translations/reducer";
import { setRegionAction } from "../../malaria/actions";
import { connect } from "react-redux";
import { Translation } from "../../types/Translation";
import { useTranslation } from "react-i18next";
import { setInsecticideClass } from "../../malaria/prevention/actions";
import { selectFilters } from "../../malaria/prevention/reducer";
import { Paper } from "@material-ui/core";

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
      padding: theme.spacing(1, 2)
    },
    radio: {
      padding: theme.spacing(0.5, 0)
    }
  })
);

const mapStateToProps = (state: State) => ({
  insecticideClasses: selectInsecticideClasses(state),
  preventionFilters: selectFilters(state)
});

const mapDispatchToProps = {
  setInsecticideClass: setInsecticideClass
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

function InsecticideClassFilter({
  insecticideClasses = [],
  preventionFilters,
  setInsecticideClass
}: Props) {
  const classes = useStyles({});
  const [value, setValue] = React.useState("female");

  function handleChange(event: React.ChangeEvent<unknown>) {
    setInsecticideClass((event.target as HTMLInputElement).value);
  }

  const { t } = useTranslation("common");

  return (
    <Paper className={classes.group}>
      <RadioGroup
        value={preventionFilters.insecticideClass}
        onChange={handleChange}
      >
        {(insecticideClasses as Translation[])
          .filter(translation => translation.VALUE_ !== "NA")
          .map((insecticideClass: Translation) => (
            <StyledFormControlLabel
              key={insecticideClass.VALUE_}
              value={insecticideClass.VALUE_}
              control={<Radio color="primary" />}
              label={t(insecticideClass.VALUE_)}
            />
          ))}
      </RadioGroup>
    </Paper>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InsecticideClassFilter);
