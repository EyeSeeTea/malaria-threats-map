import React from "react";
import { connect } from "react-redux";
import IntegrationReactSelect, { OptionType } from "../../BasicSelect";
import FormLabel from "@material-ui/core/FormLabel";
import T from "../../../translations/T";
import { Divider, FilterWrapper } from "../../filters/Filters";
import { useTranslation } from "react-i18next";

type Props = {
    includeGlobalOption?: boolean;
    menuIsOpen?: boolean;
    label?: string;
    className?: string;
    value: string[];
    onChange: (value: string[]) => void;
};

export interface FullCountry {
    iso2: string;
    name: string;
}

function FullCountriesSelector({ onChange, value, includeGlobalOption, menuIsOpen, label, className }: Props) {
    const { t } = useTranslation("fullCountries");

    const baseCountries: FullCountry[] = t("countries", { returnObjects: true });

    const countries = baseCountries.sort((t1, t2) => (t1.name < t2.name ? -1 : 1));

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
    const suggestions: any[] = countries.map((country: FullCountry) => ({
        label: country.name,
        value: country.iso2,
    }));

    const globalOption = {
        label: "Project applies globally",
        value: "GLOBAL",
    };

    const suggs = includeGlobalOption ? [...suggestions, globalOption] : suggestions;

    return (
        <FilterWrapper className={className}>
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
        </FilterWrapper>
    );
}

export default connect()(FullCountriesSelector);
