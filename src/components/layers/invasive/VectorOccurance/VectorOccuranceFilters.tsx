import React from "react";
import styled from "styled-components";
import FormLabel from "@material-ui/core/FormLabel";
import YearRangeSelector from "../../../YearRangeSelector";
import VectorSpeciesFilter from "../../../filters/VectorSpeciesFilter";

const FilterWrapper = styled.div`
  margin: 10px 20px;
`;
const Divider = styled.div`
  height: 10px;
`;

export default function VectorOccuranceFilters() {
  return (
    <div>
      <FilterWrapper>
        <FormLabel component="legend">Vector Species</FormLabel>
        <Divider />
        <VectorSpeciesFilter />
      </FilterWrapper>
      <YearRangeSelector />
    </div>
  );
}
