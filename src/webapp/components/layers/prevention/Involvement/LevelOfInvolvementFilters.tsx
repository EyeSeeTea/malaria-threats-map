import React from "react";
import YearRangeSelector from "../../../YearRangeSelector";
import SpeciesFilter from "../../../filters/SpeciesFilter";

import SynergistTypeFilter from "../../../filters/SynergistTypeFilter";
import ProxyTypeFilter from "../../../filters/ProxyTypeFilter";

export default function LevelOfInvolvementFilters() {
    return (
        <div>
            <ProxyTypeFilter />
            <SynergistTypeFilter />
            <SpeciesFilter />
            <YearRangeSelector minYear={2010} maxYear={new Date().getFullYear()} />
        </div>
    );
}
