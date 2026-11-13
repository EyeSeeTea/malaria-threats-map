import React from "react";
import InsecticideClassFilter from "../../../filters/InsecticideClassFilter";
import InsecticideTypeFilter from "../../../filters/InsecticideTypeFilter";
import TypeFilter from "../../../filters/TypeFilter";
import YearRangeSelector from "../../../YearRangeSelector";
import SpeciesFilter from "../../../filters/SpeciesFilter";
import OnlyByHealthMinistriesFilter from "../../../filters/OnlyByHealthMinistriesFilter";
import OnlyIncludeBioassaysWithMoreMosquitoesFilter from "../../../filters/OnlyIncludeBioassaysWithMoreMosquitoesFilter";

export default function IntensityStatusFilters() {
    return (
        <div>
            <InsecticideClassFilter from="map" />
            <InsecticideTypeFilter from="map" />
            <TypeFilter from="map" />
            <SpeciesFilter from="map" />
            <YearRangeSelector />
            <OnlyIncludeBioassaysWithMoreMosquitoesFilter />
            <OnlyByHealthMinistriesFilter />
        </div>
    );
}
