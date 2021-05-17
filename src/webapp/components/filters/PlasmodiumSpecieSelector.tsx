import React from "react";
import IntegrationReactSelect, { OptionType } from "../BasicSelect";
import { Divider, FilterWrapper } from "./Filters";
import FormLabel from "@material-ui/core/FormLabel";
import T from "../../translations/T";
import { ValueType } from "react-select/src/types";

type OwnProps = {
    onChange: (selection: string[]) => void;
    value: string;
};

type Props = OwnProps;

const PLASMODIUM_SPECIES_SUGGESTIONS: any[] = [
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

function PlasmodiumSpecieSelector({ onChange, value }: Props) {
    const onSelectionChange = (value: ValueType<OptionType>) => {
        const selection = value as OptionType;
        onChange(selection.value);
    };

    const selection = PLASMODIUM_SPECIES_SUGGESTIONS.filter(suggestion => value === suggestion.value);
    return (
        <FilterWrapper>
            <FormLabel component="legend">
                <T i18nKey={`filters.plasmodium_species`} />
            </FormLabel>
            <Divider />
            <IntegrationReactSelect
                suggestions={PLASMODIUM_SPECIES_SUGGESTIONS}
                onChange={onSelectionChange}
                value={selection}
            />
        </FilterWrapper>
    );
}

export default PlasmodiumSpecieSelector;
