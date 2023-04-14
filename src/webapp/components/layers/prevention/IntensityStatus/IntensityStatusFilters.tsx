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
            <InsecticideClassFilter />
            <InsecticideTypeFilter />
            <TypeFilter />
            <SpeciesFilter />
            <YearRangeSelector />
            <OnlyIncludeBioassaysWithMoreMosquitoesFilter />
            <OnlyByHealthMinistriesFilter />
        </div>
    );
}
