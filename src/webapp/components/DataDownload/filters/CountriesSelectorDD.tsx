import React from "react";
import _ from "lodash";
import { connect } from "react-redux";
import { State } from "../../../store/types";
import { Translation } from "../../../types/Translation";
import IntegrationReactSelect, { OptionType } from "../../BasicSelect";
import { selectCountries, selectTranslations } from "../../../store/reducers/translations-reducer";
import FormLabel from "@material-ui/core/FormLabel";
import T from "../../../translations/T";
import { Divider, FilterWrapper } from "../../filters/Filters";
import { useTranslation } from "react-i18next";

const mapStateToProps = (state: State) => ({
    countries: selectCountries(state),
    translations: selectTranslations(state),

});

type OwnProps = {
    includeGlobalOption?: boolean;
    menuIsOpen?: boolean;
    label?: string;
    className?: string;
    value: string[];
    countryOptions?: string[];
    onChange: (value: string[]) => void;
};

type StateProps = ReturnType<typeof mapStateToProps>;
type Props = OwnProps & StateProps;

function CountriesSelectorDD({
    onChange,
    value,
    countries = [],
    countryOptions,
    includeGlobalOption,
    menuIsOpen,
    label,
    className,
    translations
}: Props) {
    const { t } = useTranslation();
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
    console.log(countryOptions)
    console.log(countries)

    //const countriesToUse =  _.intersection(countryOptions, countries.map(country => country.EN));
    /* maybe filter the country's names 

    */
    const countriesToUse =  countries.filter(country => {
        console.log(countryOptions.includes(country.EN))
        console.log(country.EN)
        return !countryOptions.includes(country.EN)
    })

    console.log(countriesToUse)
    const suggestions: any[] = countries.map((country: Translation) => ({
        label: t(country.VALUE_ === "NA" ? "common.COUNTRY_NA" : country.VALUE_),
        value: country.VALUE_,
    }));

    const globalOption = {
        label: "Project applies globally",
        value: "GLOBAL",
    };

    const suggs = includeGlobalOption ? [...suggestions, globalOption] : suggestions;

    return (
        <FilterWrapper className={className}>
            <FormLabel component="legend">{label || <T i18nKey={"common.filters.countries"} />}</FormLabel>
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

export default connect(mapStateToProps, null)(CountriesSelectorDD);
