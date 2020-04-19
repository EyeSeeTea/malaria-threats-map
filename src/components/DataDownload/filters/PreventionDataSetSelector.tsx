import React from "react";
import IntegrationReactSelect, { OptionType } from "../../BasicSelect";
import { ValueType } from "react-select/src/types";
import { FormLabel } from "@material-ui/core";
import T from "../../../translations/T";
import { Divider, FilterWrapper } from "../../filters/Filters";
import { useTranslation } from "react-i18next";

type Props = {
  value: string;
  onChange: (selection: string) => void;
};

const suggestions: OptionType[] = [
  {
    label:
      "data_download.filters.prevention.datasets.discriminating_concentration_bioassays",
    value: "DISCRIMINATING_CONCENTRATION_BIOASSAY"
  },
  {
    label:
      "data_download.filters.prevention.datasets.intensity_concentration_bioassays",
    value: "INTENSITY_CONCENTRATION_BIOASSAY"
  },
  {
    label:
      "data_download.filters.prevention.datasets.synergist_insecticide_bioassays",
    value: "SYNERGIST-INSECTICIDE_BIOASSAY"
  },
  {
    label:
      "data_download.filters.prevention.datasets.resistance_mechanism_assays_molecular",
    value: "MOLECULAR_ASSAY"
  },
  {
    label:
      "data_download.filters.prevention.datasets.resistance_mechanism_assays_biochemical",
    value: "BIOCHEMICAL_ASSAY"
  }
];

const PreventionDataSetSelector = ({ value, onChange }: Props) => {
  const { t } = useTranslation("common");
  const valueOnChange = (value: ValueType<OptionType>) => {
    const selection = value as OptionType;
    onChange(selection.value);
  };

  const suggs = suggestions.map(s => ({ label: t(s.label), value: s.value }));

  return (
    <FilterWrapper>
      <FormLabel component="legend">
        <T i18nKey={`data_download.dataset`} /> *
      </FormLabel>
      <Divider />
      <IntegrationReactSelect
        suggestions={suggs}
        onChange={valueOnChange}
        value={suggestions.find(s => s.value === value)}
      />
    </FilterWrapper>
  );
};

export default PreventionDataSetSelector;
