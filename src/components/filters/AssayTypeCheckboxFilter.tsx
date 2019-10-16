import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import styled from "styled-components";
import { State } from "../../store/types";
import { selectAssayTypes } from "../../store/reducers/translations-reducer";
import { selectPreventionFilters } from "../../store/reducers/prevention-reducer";
import { connect } from "react-redux";
import { setAssayTypes } from "../../store/actions/prevention-actions";
import { Checkbox, FormGroup, Paper } from "@material-ui/core";
import { Translation } from "../../types/Translation";
import { useTranslation } from "react-i18next";

const WHITELISTED_ASSAY_TYPES = [
  "MOLECULAR_ASSAY",
  "BIOCHEMICAL_ASSAY",
  "SYNERGIST-INSECTICIDE_BIOASSAY"
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
    group: {
      padding: theme.spacing(1, 2)
    },
    checkbox: {
      padding: theme.spacing(0.5, 0)
    }
  })
);

const mapStateToProps = (state: State) => ({
  assayTypes: selectAssayTypes(state),
  preventionFilters: selectPreventionFilters(state)
});

const mapDispatchToProps = {
  setAssayTypes: setAssayTypes
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

function AssayTypeCheckboxFilter({
  assayTypes,
  preventionFilters,
  setAssayTypes
}: Props) {
  const classes = useStyles({});

  const handleChange = (type: string) => () => {
    if (preventionFilters.assayTypes.includes(type)) {
      setAssayTypes(
        preventionFilters.assayTypes.filter(assayType => assayType !== type)
      );
    } else {
      setAssayTypes([...preventionFilters.assayTypes, type]);
    }
  };

  const types = WHITELISTED_ASSAY_TYPES.map(value =>
    (assayTypes as Translation[]).find(type => type.VALUE_ === value)
  );

  const { t } = useTranslation("common");

  return (
    <Paper className={classes.group}>
      <FormGroup>
        {types.map(type => (
          <StyledFormControlLabel
            key={type.VALUE_}
            control={
              <Checkbox
                color="primary"
                checked={preventionFilters.assayTypes.includes(type.VALUE_)}
                onChange={handleChange(type.VALUE_)}
              />
            }
            label={t(type.VALUE_)}
          />
        ))}
      </FormGroup>
    </Paper>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AssayTypeCheckboxFilter);
