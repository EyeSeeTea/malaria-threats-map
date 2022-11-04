import React, { useContext } from "react";
import { CountryContextData } from "../../../../../../domain/entities/CountryContextData";
import { useDashboards } from "../../../context/useDashboards";
import { CountryContextDataContext } from "./CountryContextDataProvider";

export const useCountryContextData = () => {
    const { selectedCountries } = useDashboards();
    const { data } = useContext(CountryContextDataContext);
    const [filteredData, setFilteredData] = React.useState<CountryContextData[]>([]);

    React.useEffect(() => {
        if (!data) return;

        const filtered = data.filter(item => selectedCountries.includes(item.ORGANISATIONUNIT_ISO2));
        setFilteredData(filtered);
    }, [data, selectedCountries]);

    return {
        data: filteredData,
    };
};
