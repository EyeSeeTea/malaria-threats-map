import React from "react";
import styled from "styled-components";
import YearRangeSelector from "../../../YearRangeSelector";
import FormLabel from "@material-ui/core/FormLabel";
import MolecularMarkerFilter from "../../../filters/MolecularMarkerFilter";

const FilterWrapper = styled.div`
  margin: 10px 20px;
`;
const Divider = styled.div`
  height: 10px;
`;

export default function MolecularMarkerFilters() {
  return (
    <div>
      <FilterWrapper>
        <FormLabel component="legend">Molecular Marker</FormLabel>
        <Divider />
        <MolecularMarkerFilter />
      </FilterWrapper>
      <YearRangeSelector />
    </div>
  );
}
