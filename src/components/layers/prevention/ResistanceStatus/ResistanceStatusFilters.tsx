import React from "react";
import styled from "styled-components";
import FormLabel from "@material-ui/core/FormLabel";
import InsecticideClassFilter from "../../../filters/InsecticideClassFilter";
import InsecticideTypeFilter from "../../../filters/InsecticideTypeFilter";
import TypeFilter from "../../../filters/TypeFilter";
import YearRangeSelector from "../../../YearRangeSelector";
import SpeciesFilter from "../../../filters/SpeciesFilter";

const FilterWrapper = styled.div`
  margin: 10px 20px;
`;
const Divider = styled.div`
  height: 10px;
`;

export default function ResistanceStatusFilters() {
  return (
    <div>
      <FilterWrapper>
        <FormLabel component="legend">Insecticide Class</FormLabel>
        <Divider />
        <InsecticideClassFilter />
      </FilterWrapper>
      <FilterWrapper>
        <FormLabel component="legend">Insecticide Type</FormLabel>
        <Divider />
        <InsecticideTypeFilter />
      </FilterWrapper>
      <FilterWrapper>
        <FormLabel component="legend">Type</FormLabel>
        <Divider />
        <TypeFilter />
      </FilterWrapper>
      <FilterWrapper>
        <FormLabel component="legend">Vector Species</FormLabel>
        <Divider />
        <SpeciesFilter />
      </FilterWrapper>
      <YearRangeSelector />
    </div>
  );
}
