import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import styled from "styled-components";
import { State } from "../../store/types";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { Paper } from "@material-ui/core";
import { setMolecularMarker } from "../../store/actions/treatment-actions";
import { selectTreatmentFilters } from "../../store/reducers/treatment-reducer";

export const MOLECULAR_MARKERS = [
  {
    label: "Pfkelch13",
    value: 1
  },
  {
    label: "Pfcrt",
    value: 2
  },
  {
    label: "Pfmdr1",
    value: 3
  },
  {
    label: "Pfplasmepsin 2-3",
    value: 4
  }
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
  treatmentFilters: selectTreatmentFilters(state)
});

const mapDispatchToProps = {
  setMolecularMarker: setMolecularMarker
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

function MolecularMarkerFilter({
  treatmentFilters,
  setMolecularMarker
}: Props) {
  const classes = useStyles({});

  function handleChange(value: string) {
    setMolecularMarker(parseInt(value));
  }

  const { t } = useTranslation("common");

  return (
    <Paper className={classes.group}>
      <RadioGroup
        value={treatmentFilters.molecularMarker.toString()}
        onChange={(event, value) => handleChange(value)}
      >
        {MOLECULAR_MARKERS.map((suggestion: any) => (
          <StyledFormControlLabel
            key={suggestion.value}
            value={suggestion.value}
            control={<Radio color="primary" />}
            label={t(suggestion.label)}
          />
        ))}
      </RadioGroup>
    </Paper>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MolecularMarkerFilter);
