import React from "react";
import InsecticideTypeFilter from "../../../filters/InsecticideTypeFilter";
import SpeciesFilter from "../../../filters/SpeciesFilter";
import YearRangeSelector from "../../../YearRangeSelector";

export default function PboDeploymentFilters() {
  return (
    <div>
      <InsecticideTypeFilter />
      <SpeciesFilter />
      <YearRangeSelector />
    </div>
  );
}
