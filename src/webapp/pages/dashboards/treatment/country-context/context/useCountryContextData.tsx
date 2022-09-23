import i18next from "i18next";
import React, { useContext } from "react";
import { CountryContextData } from "../../../../../../domain/entities/CountryContextData";
import { useAppContext } from "../../../../../context/app-context";
import { useDashboards } from "../../../context/useDashboards";
import { CountryContextDataContext } from "./CountryContextDataProvider";

export const useCountryContextData = () => {
    const { selectedCountries } = useDashboards();
    const { data, setData } = useContext(CountryContextDataContext);
    const { compositionRoot } = useAppContext();

    const [filteredData, setFilteredData] = React.useState<CountryContextData[]>([]);

    //TODO: Remove when iso3 missing is fixed
    const [allCountries, setAllCountries] = React.useState<Record<string, string>>({});

    React.useEffect(() => {
        if (data === undefined) {
            compositionRoot.countryContext.get().run(
                data => {
                    console.log(data);
                    setData(data);
                },
                () => {
                    setData([]);
                }
            );
        }
    }, [data, compositionRoot, setData]);

    React.useEffect(() => {
        if (!data) return;

        const filtered = data.filter(item => selectedCountries.includes(item.ORGANISATIONUNIT_ISO2));
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
