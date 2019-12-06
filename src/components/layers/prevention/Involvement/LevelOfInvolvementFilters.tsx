import React from "react";
import YearRangeSelector from "../../../YearRangeSelector";
import SpeciesFilter from "../../../filters/SpeciesFilter";
import MechanismTypeFilter from "../../../filters/MechanismTypeFilter";
import SynergistTypeFilter from "../../../filters/SynergistTypeFilter";

export default function LevelOfInvolvementFilters() {
  return (
    <div>
      <MechanismTypeFilter />
      <SpeciesFilter />
      <SynergistTypeFilter />
      <YearRangeSelector minYear={2010} maxYear={new Date().getFullYear()} />
    </div>
  );
}
