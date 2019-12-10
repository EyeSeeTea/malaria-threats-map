import React from "react";
import YearRangeSelector from "../../../YearRangeSelector";
import MolecularMarkerFilter from "../../../filters/MolecularMarkerFilter";

export default function MolecularMarkerFilters() {
  return (
    <>
      <MolecularMarkerFilter />
      <YearRangeSelector />
    </>
  );
}
