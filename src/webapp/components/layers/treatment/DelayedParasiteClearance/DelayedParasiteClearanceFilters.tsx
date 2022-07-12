import React from "react";
import YearRangeSelector from "../../../YearRangeSelector";
import PlasmodiumSpeciesFilter from "../../../filters/PlasmodiumSpeciesFilter";
import DrugsFilter from "../../../filters/DrugsFilter";
import ExcludeLowerPatientsFilter from "../../../filters/ExcludeLowerPatientsFilter";

export default function DelayedParasiteClearanceFilters() {
    return (
        <>
            <PlasmodiumSpeciesFilter />
            <DrugsFilter />
            <ExcludeLowerPatientsFilter />
            <YearRangeSelector minYear={2015} maxYear={new Date().getFullYear()} />
        </>
    );
}
