import React from "react";
import IntegrationReactSelect, { Option } from "../BasicSelect";
import { Divider, FilterWrapper } from "./Filters";
import FormLabel from "@material-ui/core/FormLabel";
import T from "../../translations/T";

type OwnProps = {
  onChange: (selection: string[]) => void;
  value: string[];
};

type Props = OwnProps;

export const PLASMODIUM_SPECIES_SUGGESTIONS: any[] = [
  {
    label: "P. falciparum",
    value: "P._FALCIPARUM",
  },
  {
    label: "P. vivax",
    value: "P._VIVAX",
  },
  {
    label: "P. knowlesi",
    value: "P._KNOWLESI",
  },
  {
    label: "P. malariae",
    value: "P._MALARIAE",
  },
  {
    label: "P. ovale",
    value: "P._OVALE",
  },
];

function PlasmodiumSpeciesSelector({ onChange, value }: Props) {
  const onSelectionChange = (options: Option[] = []) => {
    onChange((options || []).map((o) => o.value));
  };

  const selection = PLASMODIUM_SPECIES_SUGGESTIONS.filter((suggestion) =>
    value.includes(suggestion.value)
  );

  return (
    <FilterWrapper>
      <FormLabel component="legend">
        <T i18nKey={`filters.plasmodium_species`} />
      </FormLabel>
      <Divider />
      <IntegrationReactSelect
        isMulti
        isClearable
        suggestions={PLASMODIUM_SPECIES_SUGGESTIONS}
        onChange={onSelectionChange}
        value={selection}
      />
    </FilterWrapper>
  );
}

export default PlasmodiumSpeciesSelector;
