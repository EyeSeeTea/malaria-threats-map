import React from "react";
import FormLabel from "@material-ui/core/FormLabel";
import InsecticideClassFilter from "../../../filters/InsecticideClassFilter";
import InsecticideTypeFilter from "../../../filters/InsecticideTypeFilter";
import SpeciesFilter from "../../../filters/SpeciesFilter";
import YearRangeSelector from "../../../YearRangeSelector";
import {
  Divider,
  FilterWrapper
} from "../ResistanceStatus/ResistanceStatusFilters";

export default function PboDeploymentFilters() {
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
        <FormLabel component="legend">Vector Species</FormLabel>
        <Divider />
        <SpeciesFilter />
      </FilterWrapper>
      <YearRangeSelector />
    </div>
  );
}
