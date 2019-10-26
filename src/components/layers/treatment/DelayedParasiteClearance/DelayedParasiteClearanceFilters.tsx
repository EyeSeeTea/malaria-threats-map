import React from "react";
import styled from "styled-components";
import FormLabel from "@material-ui/core/FormLabel";
import YearRangeSelector from "../../../YearRangeSelector";
import PlasmodiumSpeciesFilter from "../../../filters/PlasmodiumSpeciesFilter";
import DrugsFilter from "../../../filters/DrugsFilter";

const FilterWrapper = styled.div`
  margin: 10px 20px;
`;
const Divider = styled.div`
  height: 10px;
`;

export default function DelayedParasiteClearanceFilters() {
  return (
    <div>
      <FilterWrapper>
        <FormLabel component="legend">Plasmodium Species</FormLabel>
        <Divider />
        <PlasmodiumSpeciesFilter />
      </FilterWrapper>
      <FilterWrapper>
        <FormLabel component="legend">Drug</FormLabel>
        <Divider />
        <DrugsFilter />
      </FilterWrapper>
      <YearRangeSelector />
    </div>
  );
}
