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
import {
  selectPreventionFilters,
  selectPreventionStudies
} from "../../store/reducers/prevention-reducer";
import { setType } from "../../store/actions/prevention-actions";
import { Divider, FilterWrapper } from "./Filters";
import FormLabel from "@material-ui/core/FormLabel";
import {
  filterByLevelOfInvolvement,
  filterByRegion,
  filterByYearRange
} from "../layers/studies-filters";
import * as R from "ramda";
import { selectFilters, selectRegion } from "../../store/reducers/base-reducer";
import { PreventionStudy } from "../../types/Prevention";

export const WHITELISTED_TYPES = [
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
  studies: selectPreventionStudies(state),
  types: selectTypes(state),
  preventionFilters: selectPreventionFilters(state),
  yearFilter: selectFilters(state),
  region: selectRegion(state)
});

const mapDispatchToProps = {
  setType: setType
};

type OwnProps = {
  fromDb?: boolean;
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps & OwnProps;

function MechanismTypeFilter({
  studies,
  types = [],
  preventionFilters,
  setType,
  fromDb,
  yearFilter,
  region
}: Props) {
  const classes = useStyles({});
  const { t } = useTranslation("common");

  function handleChange(event: React.ChangeEvent<unknown>) {
    setType((event.target as HTMLInputElement).value);
  }

  const filters = [
    filterByLevelOfInvolvement,
    filterByYearRange(yearFilter),
    filterByRegion(region)
  ];

  const filteredStudies: PreventionStudy[] = filters.reduce(
    (studies, filter) => studies.filter(filter),
    studies
  );

  const uniques = R.map(
    unique => ({ VALUE_: unique }),
    R.uniq(R.map(R.prop("TYPE"), filteredStudies))
  );

  const suggestions: Translation[] = (fromDb
    ? uniques
    : types) as Translation[];

  const filteredTypes = fromDb
    ? suggestions
    : WHITELISTED_TYPES.map(value =>
        suggestions.find((type: any) => type.VALUE_ === value)
      ).filter(Boolean);


  return (
    <FilterWrapper>
      <FormLabel component="legend">{t(`filters.mechanism_type`)}</FormLabel>
      <Divider />
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
    </FilterWrapper>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MechanismTypeFilter);
