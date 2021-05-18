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
        label: "data_download.filters.treatment.datasets.therapeutic_efficacy_studies",
        value: "THERAPEUTIC_EFFICACY_STUDY",
    },
    {
        label: "data_download.filters.treatment.datasets.molecular_marker_studies",
        value: "MOLECULAR_MARKER_STUDY",
    },
];

const TreatmentDataSetSelector = ({ value, onChange }: Props) => {
    const { t } = useTranslation("common");
    const suggs = suggestions.map(s => ({ label: t(s.label), value: s.value }));
    const valueOnChange = (value: ValueType<OptionType, false>) => {
        const selection = value as OptionType;
        onChange(selection.value);
    };

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

export default TreatmentDataSetSelector;
