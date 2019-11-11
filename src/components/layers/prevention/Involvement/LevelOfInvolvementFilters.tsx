import React from "react";
import styled from "styled-components";
import FormLabel from "@material-ui/core/FormLabel";
import YearRangeSelector from "../../../YearRangeSelector";
import SpeciesFilter from "../../../filters/SpeciesFilter";
import MechanismTypeFilter from "../../../filters/MechanismTypeFilter";
import SynergistTypeFilter from "../../../filters/SynergistTypeFilter";

const FilterWrapper = styled.div`
  margin: 10px 20px;
`;
const Divider = styled.div`
  height: 10px;
`;

export default function LevelOfInvolvementFilters() {
  return (
    <div>
      <FilterWrapper>
        <FormLabel component="legend">Mechanism Type</FormLabel>
        <Divider />
        <MechanismTypeFilter />
      </FilterWrapper>
      <FilterWrapper>
        <FormLabel component="legend">Vector Species</FormLabel>
        <Divider />
        <SpeciesFilter />
      </FilterWrapper>
      <FilterWrapper>
        <FormLabel component="legend">Synergist Type</FormLabel>
        <Divider />
        <SynergistTypeFilter />
      </FilterWrapper>
      <YearRangeSelector minYear={2010} maxYear={new Date().getFullYear()} />
    </div>
  );
}
