import React from "react";
import MolecularMarkerCheckboxFilter from "../../../filters/MolecularMarkerCheckboxFilter";
import YearRangeSelector from "../../../YearRangeSelector";

export default function MolecularMarkersOngoingStudiesFilters() {
    return (
        <>
            <MolecularMarkerCheckboxFilter />
            <YearRangeSelector />
        </>
    );
}
