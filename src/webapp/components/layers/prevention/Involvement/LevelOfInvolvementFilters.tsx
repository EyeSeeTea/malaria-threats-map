import React from "react";
import { PreventionDiseaseFilter } from "../../../filters/DiseaseFilter";
import YearRangeSelector from "../../../YearRangeSelector";
import SpeciesFilter from "../../../filters/SpeciesFilter";

import SynergistTypeFilter from "../../../filters/SynergistTypeFilter";
import ProxyTypeFilter from "../../../filters/ProxyTypeFilter";
import InsecticideClassFilter from "../../../filters/InsecticideClassFilter";
import InsecticideTypeFilter from "../../../filters/InsecticideTypeFilter";

export default function LevelOfInvolvementFilters() {
    return (
        <div>
            <PreventionDiseaseFilter />
            <ProxyTypeFilter />
            <InsecticideClassFilter from="map" />
            <InsecticideTypeFilter from="map" />
            <SynergistTypeFilter />
            <SpeciesFilter from="map" />
            <YearRangeSelector />
        </div>
    );
}
