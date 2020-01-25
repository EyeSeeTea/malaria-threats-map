import React from "react";
import { State } from "../../store/types";
import { connect } from "react-redux";
import { FormLabel } from "@material-ui/core";
import { selectPatientType } from "../../store/reducers/translations-reducer";
import { Divider, FilterWrapper } from "./Filters";
import { selectFilters, selectRegion } from "../../store/reducers/base-reducer";
import {
  selectDiagnosisFilters,
  selectDiagnosisStudies
} from "../../store/reducers/diagnosis-reducer";
import { setDiagnosisPatientType } from "../../store/actions/diagnosis-actions";
import T from "../../translations/T";
import IntegrationReactSelect from "../BasicSelect";

const THEMES = [
  {
    label: "themes.prevention",
    value: "PREVENTION"
  },
  {
    label: "themes.diagnosis",
    value: "DIAGNOSIS"
  },
  {
    label: "themes.treatment",
    value: "TREATMENT"
  },
  {
    label: "themes.invasive",
    value: "INVASIVE"
  }
];
const mapStateToProps = (state: State) => ({
  patientType: selectPatientType(state),
  studies: selectDiagnosisStudies(state),
  yearFilter: selectFilters(state),
  diagnosisFilters: selectDiagnosisFilters(state),
  region: selectRegion(state)
});

const mapDispatchToProps = {
  setPatientType: setDiagnosisPatientType
};

function ThemeFilter() {
  return (
    <FilterWrapper>
      <FormLabel component="legend">
        <T i18nKey={`data_download.step3.filters.theme`} />
      </FormLabel>
      <Divider />
      <IntegrationReactSelect
        isClearable
        suggestions={THEMES}
        onChange={() => {}}
        value={undefined}
      />
    </FilterWrapper>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ThemeFilter);
