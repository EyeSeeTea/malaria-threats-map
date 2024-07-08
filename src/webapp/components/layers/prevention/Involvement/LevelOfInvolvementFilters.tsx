import React from "react";
import YearRangeSelector from "../../../YearRangeSelector";
import SpeciesFilter from "../../../filters/SpeciesFilter";

import SynergistTypeFilter from "../../../filters/SynergistTypeFilter";
import ProxyTypeFilter from "../../../filters/ProxyTypeFilter";
import InsecticideClassFilter from "../../../filters/InsecticideClassFilter";
import InsecticideTypeFilter from "../../../filters/InsecticideTypeFilter";

export default function LevelOfInvolvementFilters() {
    return (
        <div>
            <ProxyTypeFilter />
            <InsecticideClassFilter />
            <InsecticideTypeFilter />
            <SynergistTypeFilter />
            <SpeciesFilter />
            <YearRangeSelector />
        </div>
    );
}
