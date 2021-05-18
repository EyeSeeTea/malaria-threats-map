import React from "react";
import YearRangeSelector from "../../../YearRangeSelector";
import SurveyTypeFilter from "../../../filters/SurveyTypeFilter";
import PatientTypeFilter from "../../../filters/PatientTypeFilter";
import DeletionTypeFilter from "../../../filters/DeletionTypeFilter";
import Pfhrp23Note from "./Pfhrp23Note";

export default function GeneDeletionFilters() {
    return (
        <>
            <DeletionTypeFilter />
            <SurveyTypeFilter />
            <PatientTypeFilter />
            <YearRangeSelector minYear={1998} maxYear={new Date().getFullYear()} />
            <Pfhrp23Note />
        </>
    );
}
