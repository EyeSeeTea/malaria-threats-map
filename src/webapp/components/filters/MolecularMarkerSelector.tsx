import React from "react";
import IntegrationReactSelect, { Option } from "../BasicSelect";
import { Divider, FilterWrapper } from "./Filters";
import T from "../../translations/T";
import { MOLECULAR_MARKERS } from "./MolecularMarkerFilter";
import { FormLabel } from "@material-ui/core";

type OwnProps = {
  onChange: (selection: string[]) => void;
  value: string[];
};

type Props = OwnProps;

const suggestions = MOLECULAR_MARKERS.map(s => ({ ...s, value: `${s.value}` }));

function MolecularMarkerSelector({ onChange, value }: Props) {
  const onSelectionChange = (options: Option[] = []) => {
    onChange((options || []).map(o => o.value));
  };

  const selection = suggestions.filter(suggestion =>
    value.includes(`${suggestion.value}`)
  );

  return (
    <FilterWrapper>
      <FormLabel component="legend">
        <T i18nKey={`filters.molecular_marker`} />
      </FormLabel>
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
export default MolecularMarkerSelector;
