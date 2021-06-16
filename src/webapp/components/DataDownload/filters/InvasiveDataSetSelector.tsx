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
        label: "common.data_download.filters.invasive.datasets.invasive_vector_species",
        value: "INVASIVE_VECTOR_SPECIES",
    },
];

const InvasiveDataSetSelector = ({ value, onChange }: Props) => {
    const { t } = useTranslation();
    const valueOnChange = (value: ValueType<OptionType, false>) => {
        const selection = value as OptionType;
        onChange(selection.value);
    };

    const suggs = suggestions.map(s => ({ label: t(s.label), value: s.value }));

    return (
        <FilterWrapper>
            <FormLabel component="legend">
                <T i18nKey={"common.data_download.dataset"} /> *
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

export default InvasiveDataSetSelector;
