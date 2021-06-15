import React from "react";
import { connect } from "react-redux";
import IntegrationReactSelect, { OptionType } from "../../BasicSelect";
import FormLabel from "@material-ui/core/FormLabel";
import T from "../../../translations/T";
import { Divider, FilterSimpleWrapper } from "../../filters/Filters";
import { useTranslation } from "react-i18next";

type Props = {
    includeGlobalOption?: boolean;
    menuIsOpen?: boolean;
    label?: string;
    value: string[];
    onChange: (value: string[]) => void;
};

export interface FullCountry {
    [key: string]: string;
}

function FullCountriesSelector({ onChange, value, includeGlobalOption, menuIsOpen, label }: Props) {
    const { t } = useTranslation();

    const baseCountries: FullCountry = t("countries", { returnObjects: true });
    const global = value.includes("GLOBAL");
    const onOptionChange = (selection: OptionType[] | OptionType | undefined) => {
        if (!selection) {
            onChange([]);
        } else if (Array.isArray(selection) && selection) {
            const values = selection.map(selection => selection.value);
            if (values.includes("GLOBAL")) {
                onChange(["GLOBAL"]);
            } else {
                onChange(values);
            }
        } else {
            const optionType = selection as OptionType;
            if (optionType.value) {
                onChange([optionType.value]);
            }
        }
    };
    const suggestions: any[] = Object.entries(baseCountries).map(([iso, name]) => ({
        label: name,
        value: iso,
    }));

    const globalOption = {
        label: "Project applies globally",
        value: "GLOBAL",
    };

    const suggs = includeGlobalOption ? [...suggestions, globalOption] : suggestions;

    return (
        <FilterSimpleWrapper>
            <FormLabel component="legend">{label || <T i18nKey={"filters.countries"} />}</FormLabel>
            <Divider />
            <IntegrationReactSelect
                isClearable
                isMulti={!value.includes("GLOBAL")}
                suggestions={suggs}
                onChange={onOptionChange}
                value={global ? globalOption : suggs.filter(s => value.includes(s.value))}
                menuIsOpen={menuIsOpen}
            />
        </FilterSimpleWrapper>
    );
}

export default connect()(FullCountriesSelector);
