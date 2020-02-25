import React from "react";
import IntegrationReactSelect, { Option } from "../BasicSelect";
import { Divider, FilterWrapper } from "./Filters";
import FormLabel from "@material-ui/core/FormLabel";
import { useTranslation } from "react-i18next";
import { WHITELISTED_TYPES } from "./MechanismTypeFilter";

type OwnProps = {
  onChange: (selection: string[]) => void;
  value: string[];
};

type Props = OwnProps;

function MechanismsTypeSelector({ onChange, value }: Props) {
  const { t } = useTranslation("common");

  const suggestions: any[] = WHITELISTED_TYPES.map((specie: string) => ({
    label: specie,
    value: specie
  }));

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
