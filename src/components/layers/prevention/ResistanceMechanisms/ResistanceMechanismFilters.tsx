import React from "react";
import styled from "styled-components";
import FormLabel from "@material-ui/core/FormLabel";
import InsecticideClassFilter from "../../../filters/InsecticideClassFilter";
import InsecticideTypeFilter from "../../../filters/InsecticideTypeFilter";
import TypeFilter from "../../../filters/TypeFilter";
import YearRangeSelector from "../../../YearRangeSelector";
import SpeciesFilter from "../../../filters/SpeciesFilter";
import MechanismTypeFilter from "../../../filters/MechanismTypeFilter";
import AssayTypeCheckboxFilter from "../../../filters/AssayTypeCheckboxFilter";
import { PreventionFilters, State } from "../../../../store/types";
import { selectAssayTypes } from "../../../../store/reducers/translations-reducer";
import { selectPreventionFilters } from "../../../../store/reducers/prevention-reducer";
import { setAssayTypes } from "../../../../store/actions/prevention-actions";
import { connect } from "react-redux";
import SynergistTypeFilter from "../../../filters/SynergistTypeFilter";

const FilterWrapper = styled.div`
  margin: 10px 20px;
`;
const Divider = styled.div`
  height: 10px;
`;

const mapStateToProps = (state: State) => ({
  preventionFilters: selectPreventionFilters(state)
});

type StateProps = ReturnType<typeof mapStateToProps>;
type Props = StateProps;

export const isSynergyst = (filters: PreventionFilters) =>
  filters.assayTypes.length === 1 &&
  filters.assayTypes[0] === "SYNERGIST-INSECTICIDE_BIOASSAY";

function ResistanceMechanismFilters({ preventionFilters }: Props) {
  return (
    <div>
      <FilterWrapper>
        <FormLabel component="legend">Mechanism Type</FormLabel>
        <Divider />
        <MechanismTypeFilter />
      </FilterWrapper>
      <FilterWrapper>
        <FormLabel component="legend">Assay Type</FormLabel>
        <Divider />
        <AssayTypeCheckboxFilter />
      </FilterWrapper>
      <FilterWrapper>
        <FormLabel component="legend">Vector Species</FormLabel>
        <Divider />
        <SpeciesFilter />
      </FilterWrapper>
      {isSynergyst(preventionFilters) && (
        <FilterWrapper>
          <FormLabel component="legend">Synergist Type</FormLabel>
          <Divider />
          <SynergistTypeFilter />
        </FilterWrapper>
      )}
      <YearRangeSelector />
    </div>
  );
}

export default connect(
  mapStateToProps,
  null
)(ResistanceMechanismFilters);
