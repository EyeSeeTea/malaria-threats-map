import React from "react";
import RadioGroupFilter from "./RadioGroupFilter";
import i18next from "i18next";

type Option<T> = {
    label: string;
    value: T;
};

export type DisaggregateBySpeciesOptions = "aggregate_species" | "disaggregate_species";

const DISAGGREGATE_BY_SPECIES_OPTIONS: Option<DisaggregateBySpeciesOptions>[] = [
    {
        label: i18next.t("common.filters.disaggregate_by_species.aggregate_species"),
        value: "aggregate_species",
    },
    {
        label: i18next.t("common.filters.disaggregate_by_species.disaggregate_species"),
        value: "disaggregate_species",
    },
];

interface Props {
    onChange: (selection: DisaggregateBySpeciesOptions) => void;
    value: string;
}

function DisaggregateBySpeciesSelector({ onChange, value }: Props) {
    const handleRadioChange = React.useCallback(
        (event: React.ChangeEvent<unknown>) => {
            const value = (event.target as HTMLInputElement).value as DisaggregateBySpeciesOptions;
            onChange(value);
        },
        [onChange]
    );

    return (
        <RadioGroupFilter
            options={DISAGGREGATE_BY_SPECIES_OPTIONS}
            handleChange={handleRadioChange}
            margin={"10px 0px"}
            padding={"10px 0px"}
            value={value}
            background={"white"}
            labelFontSize="14px"
            labelFontWeight="bold"
        />
    );
}

export default DisaggregateBySpeciesSelector;
