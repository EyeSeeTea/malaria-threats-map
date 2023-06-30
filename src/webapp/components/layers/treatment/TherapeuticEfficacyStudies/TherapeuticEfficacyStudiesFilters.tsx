import React from "react";
import YearRangeSelector from "../../../YearRangeSelector";
import PlasmodiumSpeciesFilter from "../../../filters/PlasmodiumSpeciesFilter";
import DrugsFilter from "../../../filters/DrugsFilter";

export default function TherapeuticEfficacyStudiesFilters() {
    return (
        <>
            <PlasmodiumSpeciesFilter />
            <DrugsFilter />
            <YearRangeSelector />
        </>
    );
}
