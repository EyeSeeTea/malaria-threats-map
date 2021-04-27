import React from "react";
import YearRangeSelector from "../../../YearRangeSelector";
import PlasmodiumSpeciesFilter from "../../../filters/PlasmodiumSpeciesFilter";
import DrugsFilter from "../../../filters/DrugsFilter";

export default function TreatmentFailureFilters() {
    return (
        <>
            <PlasmodiumSpeciesFilter />
            <DrugsFilter />
            <YearRangeSelector minYear={2010} maxYear={new Date().getFullYear()} />
        </>
    );
}
