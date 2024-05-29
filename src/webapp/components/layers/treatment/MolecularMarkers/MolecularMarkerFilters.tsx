import React from "react";
import YearRangeSelector from "../../../YearRangeSelector";
import MolecularMarkerRadioFilter from "../../../filters/MolecularMarkerRadioFilter";
import ExcludeLowerSamplesFilter from "../../../filters/ExcludeLowerSamplesFilter";

export default function MolecularMarkerFilters() {
    return (
        <>
            <MolecularMarkerRadioFilter />
            <ExcludeLowerSamplesFilter />
            <YearRangeSelector />
        </>
    );
}
