import React from "react";
import InsecticideClassFilter from "../../../filters/InsecticideClassFilter";
import InsecticideTypeFilter from "../../../filters/InsecticideTypeFilter";
import TypeFilter from "../../../filters/TypeFilter";
import YearRangeSelector from "../../../YearRangeSelector";
import SpeciesFilter from "../../../filters/SpeciesFilter";

interface Props {
    years: Record<string, number>;
}

const ResistanceStatusFilters: React.FC<Props> = ({ years }) => {
    return (
        <div>
            <InsecticideClassFilter />
            <InsecticideTypeFilter />
            <TypeFilter />
            <SpeciesFilter />
            <YearRangeSelector minYear={years.minYear} maxYear={years.maxYear} />
        </div>
    );
};
export default ResistanceStatusFilters;
