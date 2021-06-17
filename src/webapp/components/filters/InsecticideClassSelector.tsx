import React from "react";
import { useTranslation } from "react-i18next";
import FormLabel from "@material-ui/core/FormLabel";
import { Divider, FilterWrapper } from "./Filters";
import IntegrationReactSelect, { Option } from "../BasicSelect";
import { INSECTICIDE_CLASSES } from "./InsecticideClassFilter";

type OwnProps = {
    onChange: (selection: string[]) => void;
    value: string[];
};

type Props = OwnProps;

function InsecticideClassSelector({ value, onChange }: Props) {
    const { t } = useTranslation();

    const suggestions: Option[] = INSECTICIDE_CLASSES.map((specie: string) => ({
        label: t(specie),
        value: specie,
    }));

    const onSelectionChange = (options: Option[]) => {
        onChange((options || []).map(o => o.value));
    };

    return (
        <FilterWrapper>
            <FormLabel component="legend">{t("common.filters.insecticide_class")}</FormLabel>
            <Divider />
            <IntegrationReactSelect
                isMulti
                isClearable
                suggestions={suggestions}
                onChange={onSelectionChange}
                value={suggestions.filter(s => value.includes(s.value))}
            />
        </FilterWrapper>
    );
}
export default InsecticideClassSelector;
