import React from "react";
import styled from "styled-components";
import FormLabel from "@material-ui/core/FormLabel";
import YearRangeSelector from "../../../YearRangeSelector";
import SurveyTypeFilter from "../../../filters/SurveyTypeFilter";
import PatientTypeFilter from "../../../filters/PatientTypeFilter";

const FilterWrapper = styled.div`
  margin: 10px 20px;
`;
const Divider = styled.div`
  height: 10px;
`;

export default function Pfhrp2Filters() {
  return (
    <div>
      <FilterWrapper>
        <FormLabel component="legend">Survey Types</FormLabel>
        <Divider />
        <SurveyTypeFilter />
      </FilterWrapper>
      <FilterWrapper>
        <FormLabel component="legend">Patient Type</FormLabel>
        <Divider />
        <PatientTypeFilter />
      </FilterWrapper>
      <YearRangeSelector />
    </div>
  );
}
