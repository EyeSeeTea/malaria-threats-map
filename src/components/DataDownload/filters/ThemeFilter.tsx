import React from "react";
import { State } from "../../../store/types";
import { connect } from "react-redux";
import { FormLabel } from "@material-ui/core";
import { Divider, FilterWrapper } from "../../filters/Filters";
import T from "../../../translations/T";
import IntegrationReactSelect from "../../BasicSelect";

const THEMES = [
  {
    label: "themes.prevention",
    value: "prevention"
  },
  // {
  //   label: "themes.diagnosis",
  //   value: "diagnosis"
  // },
  {
    label: "themes.treatment",
    value: "treatment"
  },
  {
    label: "themes.invasive",
    value: "invasive"
  }
];
const mapStateToProps = (state: State) => ({});

const mapDispatchToProps = {};

type OwnProps = {
  value: string;
  onChange: (value: string) => void;
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps & OwnProps;

function ThemeFilter({ value, onChange }: Props) {
  return (
    <FilterWrapper>
      <FormLabel component="legend">
        <T i18nKey={`data_download.step3.filters.theme`} /> *
      </FormLabel>
      <Divider />
      <IntegrationReactSelect
        suggestions={THEMES}
        onChange={(selection: any) => {
          return onChange(selection.value);
        }}
        value={THEMES.find(theme => theme.value === value)}
      />
    </FilterWrapper>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ThemeFilter);
