import React from "react";
import IntegrationReactSelect, { Option } from "../BasicSelect";
import { Divider, FilterWrapper } from "./Filters";
import FormLabel from "@material-ui/core/FormLabel";
import { useTranslation } from "react-i18next";
import { WHITELISTED_TYPES } from "./MechanismTypeFilter";
import {
  BIOCHEMICAL_MECHANISM_TYPES,
  MOLECULAR_MECHANISM_TYPES
} from "../DataDownload";
import * as R from "ramda";

type OwnProps = {
  onChange: (selection: string[]) => void;
  value: string[];
  dataset?: string;
};

type Props = OwnProps;

function MechanismsTypeSelector({ onChange, value, dataset }: Props) {
  const { t } = useTranslation("common");

  const types = (() => {
    switch (dataset) {
      case "MOLECULAR_ASSAY":
        return MOLECULAR_MECHANISM_TYPES;
      case "BIOCHEMICAL_ASSAY":
        return BIOCHEMICAL_MECHANISM_TYPES;
      default:
        return WHITELISTED_TYPES;
    }
  })();

  const suggestions: any[] = R.sortBy(
    R.prop("label"),
    types.map((specie: string) => ({
      label: t(specie),
      value: specie
    }))
  );

  const onSelectionChange = (options: Option[] = []) => {
    onChange((options || []).map(o => o.value));
  };

  const selection = suggestions.filter(suggestion =>
    value.includes(suggestion.value)
  );

  return (
    <FilterWrapper>
      <FormLabel component="legend">{t(`filters.mechanism_type`)}</FormLabel>
      <Divider />
      <IntegrationReactSelect
        isMulti
        isClearable
        suggestions={suggestions}
        onChange={onSelectionChange}
        value={selection}
      />
    </FilterWrapper>
  );
}
export default MechanismsTypeSelector;
