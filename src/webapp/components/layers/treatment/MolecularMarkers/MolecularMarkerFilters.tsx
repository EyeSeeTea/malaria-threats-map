import React from "react";
import YearRangeSelector from "../../../YearRangeSelector";
import MolecularMarkerFilter from "../../../filters/MolecularMarkerFilter";
import ExcludeLowerSamplesFilter from "../../../filters/ExcludeLowerSamplesFilter";

export default function MolecularMarkerFilters() {
    return (
        <>
            <MolecularMarkerFilter />
            <ExcludeLowerSamplesFilter />
            <YearRangeSelector minYear={2010} maxYear={new Date().getFullYear()} />
        </>
    );
}
