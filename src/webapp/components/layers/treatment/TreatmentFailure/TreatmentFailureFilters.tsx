import React from "react";
import YearRangeSelector from "../../../YearRangeSelector";
import PlasmodiumSpeciesFilter from "../../../filters/PlasmodiumSpeciesFilter";
import DrugsFilter from "../../../filters/DrugsFilter";
import ExcludeLowerPatientsFilter from "../../../filters/ExcludeLowerPatientsFilter";

export default function TreatmentFailureFilters() {
    return (
        <>
            <PlasmodiumSpeciesFilter />
            <DrugsFilter />
            <ExcludeLowerPatientsFilter />
            <YearRangeSelector />
        </>
    );
}
