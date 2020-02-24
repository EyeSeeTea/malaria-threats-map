import React from "react";
import IntegrationReactSelect, { Option } from "../BasicSelect";
import { Divider, FilterWrapper } from "./Filters";
import T from "../../translations/T";
import { MOLECULAR_MARKERS } from "./MolecularMarkerFilter";

type OwnProps = {
  onChange: (selection: string[]) => void;
  value: string[];
};

type Props = OwnProps;

function MechanismsTypeSelector({ onChange, value }: Props) {
  const onSelectionChange = (options: Option[] = []) => {
    onChange(options.map(o => o.value));
  };

  const selection = MOLECULAR_MARKERS.filter(suggestion =>
    value.includes(`${suggestion.value}`)
  );

  return (
    <FilterWrapper>
      <T i18nKey={`filters.molecular_marker`} />
      <Divider />
      <IntegrationReactSelect
        isMulti
        isClearable
        suggestions={MOLECULAR_MARKERS}
        onChange={onSelectionChange}
        value={selection}
      />
    </FilterWrapper>
  );
}
export default MechanismsTypeSelector;
