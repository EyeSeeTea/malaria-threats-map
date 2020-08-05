import React, { useState } from "react";
import { connect } from "react-redux";
import { setRegionAction } from "../../store/actions/base-actions";
import { selectRegion, selectTheme } from "../../store/reducers/base-reducer";
import { State } from "../../store/types";
import IntegrationReactSelect from "../BasicSelect";
import FormLabel from "@material-ui/core/FormLabel";
import { Divider, FilterWrapper } from "./Filters";
import { selectFilteredPreventionStudies } from "../../store/reducers/prevention-reducer";
import { selectFilteredDiagnosisStudies } from "../../store/reducers/diagnosis-reducer";
import { selectFilteredTreatmentStudies } from "../../store/reducers/treatment-reducer";
import { selectFilteredInvasiveStudies } from "../../store/reducers/invasive-reducer";
import { Study } from "../../types/Malaria";
import * as R from "ramda";

const mapStateToProps = (state: State) => ({
  theme: selectTheme(state),
  preventionStudies: selectFilteredPreventionStudies(state),
  diagnosisStudies: selectFilteredDiagnosisStudies(state),
  treatmentStudies: selectFilteredTreatmentStudies(state),
  invasiveStudies: selectFilteredInvasiveStudies(state),
  region: selectRegion(state),
});

const mapDispatchToProps = {
  setRegion: setRegionAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

function SiteSelector({
  theme,
  preventionStudies,
  diagnosisStudies,
  treatmentStudies,
  invasiveStudies,
  region,
  setRegion,
}: Props) {
  const [input, setInput] = useState("");
  const onChange = (selection: any) => {
    setRegion({
      site: selection ? selection.value : undefined,
      siteIso2: selection ? selection.iso2 : undefined,
      siteCoordinates: selection ? selection.coords : undefined,
    });
  };
  const studies: Study[] = (() => {
    switch (theme) {
      case "prevention":
        return preventionStudies;
      case "diagnosis":
        return diagnosisStudies;
      case "treatment":
        return treatmentStudies;
      case "invasive":
        return invasiveStudies;
    }
  })();

  console.log(studies.length)

  const SITES_SUGGESTIONS = R.uniqBy(
    (study) => study.value,
    studies.map((study) => ({
      label: study.SITE_NAME || study.VILLAGE_NAME,
      value: study.SITE_ID,
      iso2: study.ISO2,
      coords: [study.Latitude, study.Longitude],
    }))
  );

  const suggestions = SITES_SUGGESTIONS.filter(
    (suggestion) =>
      suggestion.label &&
      suggestion.label.toLowerCase().startsWith(input.toLowerCase())
  ).slice(0, 10);

  return (
    <FilterWrapper>
      <FormLabel component="legend">Site</FormLabel>
      <Divider />
      <IntegrationReactSelect
        isClearable
        placeholder={"Select Site"}
        suggestions={suggestions}
        onChange={onChange}
        onInputChange={setInput}
        value={
          SITES_SUGGESTIONS.find((s: any) => s.value === region.site) || null
        }
      />
    </FilterWrapper>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(SiteSelector);
