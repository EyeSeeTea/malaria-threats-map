import i18next from "i18next";
import React, { useContext } from "react";
import { CountryContextData } from "../../../../../../domain/entities/CountryContextData";
import { useDashboards } from "../../../context/useDashboards";
import { CountryContextDataContext } from "./CountryContextDataProvider";

export const useCountryContextData = () => {
    const { selectedCountries } = useDashboards();
    const { data } = useContext(CountryContextDataContext);

    const [filteredData, setFilteredData] = React.useState<CountryContextData[]>([]);

    //TODO: Remove when iso3 missing is fixed
    const [allCountries, setAllCountries] = React.useState<Record<string, string>>({});

    React.useEffect(() => {
        if (!data) return;
        //TODO: Remove when iso3 missing is fixed
        const countries = Object.keys(allCountries)
            .filter(countryIso => selectedCountries.includes(countryIso))
            .map(countryIso => allCountries[countryIso]);

        const filtered = data.filter(item => countries.includes(item.ORGANISATIONUNITNAME));
        setFilteredData(filtered);
    }, [data, selectedCountries, allCountries]);

    React.useEffect(() => {
        //TODO: Remove when iso3 missing is fixed
        const countries = i18next.getResource("en", "translation", "countries");
        setAllCountries(countries);
    }, []);

    return {
        data: filteredData,
    };
};
