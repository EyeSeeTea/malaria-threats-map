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
import { Divider, FilterWrapper } from "./Filters";
import FormLabel from "@material-ui/core/FormLabel";
import T from "../../translations/T";
import { logEventAction } from "../../store/actions/base-actions";

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
  setMolecularMarker: setMolecularMarker,
  logEventAction: logEventAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

function MolecularMarkerFilter({
  treatmentFilters,
  setMolecularMarker,
  logEventAction
}: Props) {
  const classes = useStyles({});

  function handleChange(value: string) {
    const nValue = parseInt(value);
    setMolecularMarker(nValue);
    const obj = MOLECULAR_MARKERS.find(m => m.value === nValue);
    const label = obj ? obj.label : undefined;
    logEventAction({ category: "filter", action: "molecularMarkers", label });
  }

  const { t } = useTranslation("common");

  return (
    <FilterWrapper>
      <FormLabel component="legend">
        <T i18nKey={`filters.molecular_marker`} />
      </FormLabel>
      <Divider />
      <Paper className={classes.group}>
        <RadioGroup
          value={treatmentFilters.molecularMarker.toString()}
          onChange={(event, value) => handleChange(value)}
        >
          {MOLECULAR_MARKERS.map((suggestion: any) => (
            <StyledFormControlLabel
              key={suggestion.value}
              value={suggestion.value.toString()}
              control={<Radio color="primary" />}
              label={t(suggestion.label)}
            />
          ))}
        </RadioGroup>
      </Paper>
    </FilterWrapper>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MolecularMarkerFilter);
