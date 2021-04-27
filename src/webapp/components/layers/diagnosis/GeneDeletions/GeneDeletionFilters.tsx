import React from "react";
import YearRangeSelector from "../../../YearRangeSelector";
import SurveyTypeFilter from "../../../filters/SurveyTypeFilter";
import PatientTypeFilter from "../../../filters/PatientTypeFilter";
import DeletionTypeFilter from "../../../filters/DeletionTypeFilter";

export default function GeneDeletionFilters() {
    return (
        <>
            <DeletionTypeFilter />
            <SurveyTypeFilter />
            <PatientTypeFilter />
            <YearRangeSelector minYear={1998} maxYear={new Date().getFullYear()} />
        </>
    );
}
