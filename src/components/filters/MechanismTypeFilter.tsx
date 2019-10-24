import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import styled from "styled-components";
import { State } from "../../store/types";
import { connect } from "react-redux";
import { Translation } from "../../types/Translation";
import { useTranslation } from "react-i18next";
import { Paper } from "@material-ui/core";
import { selectTypes } from "../../store/reducers/translations-reducer";
import { selectPreventionFilters } from "../../store/reducers/prevention-reducer";
import { setType } from "../../store/actions/prevention-actions";

const WHITELISTED_TYPES = [
  "MONO_OXYGENASES",
  "ESTERASES",
  "GSTS",
  "KDR_L1014S",
  "KDR_L1014F",
  "KDR_(MUTATION_UNSPECIFIED)",
  "ACE1R"
];

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
  types: selectTypes(state),
  preventionFilters: selectPreventionFilters(state)
});

const mapDispatchToProps = {
  setType: setType
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

function MechanismTypeFilter({
  types = [],
  preventionFilters,
  setType
}: Props) {
  const classes = useStyles({});

  function handleChange(event: React.ChangeEvent<unknown>) {
    setType((event.target as HTMLInputElement).value);
  }

  const filteredTypes = WHITELISTED_TYPES.map(value =>
    (types as Translation[]).find(type => type.VALUE_ === value)
  );

  const { t } = useTranslation("common");

  return (
    <Paper className={classes.group}>
      <RadioGroup value={preventionFilters.type} onChange={handleChange}>
        {filteredTypes
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
)(MechanismTypeFilter);
