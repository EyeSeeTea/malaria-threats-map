import React from "react";
import YearRangeSelector from "../../../YearRangeSelector";
import VectorSpeciesFilter from "../../../filters/VectorSpeciesFilter";

export default function VectorOccuranceFilters() {
  return (
    <>
      <VectorSpeciesFilter />
      <YearRangeSelector />
    </>
  );
}
