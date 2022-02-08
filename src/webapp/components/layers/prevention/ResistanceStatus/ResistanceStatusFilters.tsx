import React from "react";
import InsecticideClassFilter from "../../../filters/InsecticideClassFilter";
import InsecticideTypeFilter from "../../../filters/InsecticideTypeFilter";
import TypeFilter from "../../../filters/TypeFilter";
import YearRangeSelector from "../../../YearRangeSelector";
import SpeciesFilter from "../../../filters/SpeciesFilter";

function ResistanceStatusFilters() {
    return (
        <div>
            <InsecticideClassFilter />
            <InsecticideTypeFilter />
            <TypeFilter />
            <SpeciesFilter />
            <YearRangeSelector minYear={2010} maxYear={new Date().getFullYear()} />        
        </div>
    );
}

export default ResistanceStatusFilters;
