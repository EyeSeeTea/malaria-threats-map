import React from "react";
import ThemeFilter from "./filters/ThemeFilter";
import { State } from "../../store/types";
import { selectTheme } from "../../store/reducers/base-reducer";
import { setThemeAction } from "../../store/actions/base-actions";
import { connect } from "react-redux";
import PreventionDataSetSelector from "./filters/PreventionDataSetSelector";
import InvasiveDataSetSelector from "./filters/InvasiveDataSetSelector";
import TreatmentDataSetSelector from "./filters/TreatmentDataSetSelector";
import YearsSelector from "./filters/YearsSelector";
import CountriesSelector from "./filters/CountriesSelector";

const mapStateToProps = (state: State) => ({
  theme: selectTheme(state)
});

const mapDispatchToProps = {
  setTheme: setThemeAction
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const Filters = ({ theme: initialTheme }: Props) => {
  const [theme, setTheme] = React.useState(initialTheme);
  const [preventionDataset, setPreventionDataset] = React.useState(undefined);
  const [treatmentDataset, setTreatmentDataset] = React.useState(undefined);
  const [invasiveDataset, setInvasiveDataset] = React.useState(undefined);
  const [years, setYears] = React.useState<number[]>([]);
  const [countries, setCountries] = React.useState<string[]>([]);

  return (
    <div>
      <ThemeFilter value={theme} onChange={setTheme} />
      {theme === "prevention" && (
        <PreventionDataSetSelector
          value={preventionDataset}
          onChange={setPreventionDataset}
        />
      )}
      {theme === "treatment" && (
        <TreatmentDataSetSelector
          value={treatmentDataset}
          onChange={setTreatmentDataset}
        />
      )}
      {theme === "invasive" && (
        <InvasiveDataSetSelector
          value={invasiveDataset}
          onChange={setInvasiveDataset}
        />
      )}
      {(preventionDataset || treatmentDataset || invasiveDataset) && (
        <YearsSelector value={years} onChange={setYears} />
      )}
      {(preventionDataset || treatmentDataset || invasiveDataset) && (
        <CountriesSelector value={countries} onChange={setCountries} />
      )}
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Filters);
