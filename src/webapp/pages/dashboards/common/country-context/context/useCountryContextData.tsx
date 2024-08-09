import React, { useContext } from "react";
import { CountryContextData } from "../../../../../../domain/entities/CountryContextData";
import { useDashboards } from "../../../context/useDashboards";
import { CountryContextDataContext } from "./CountryContextDataProvider";
import { DashboardSourceInfo } from "../../../../../../domain/entities/DashboardSourceInfo";

export type DataSourceInfo = {
    name: string;
    year: number;
    link?: string;
};

export const useCountryContextData = () => {
    const { selectedCountries } = useDashboards();
    const { data, dataSource } = useContext(CountryContextDataContext);
    const [filteredData, setFilteredData] = React.useState<CountryContextData[]>([]);
    const [currentDataSourceInfo, setCurrentDataSourceInfo] = React.useState<DataSourceInfo[]>([]);

    React.useEffect(() => {
        if (!data || !dataSource) return;

        const filtered = data.filter(item => selectedCountries.includes(item.ORGANISATIONUNIT_ISO2));
        const currentDataSourceInfo = getCurrentDataSourceInfo(dataSource, filtered);
        setFilteredData(filtered);
        setCurrentDataSourceInfo(currentDataSourceInfo);
    }, [data, selectedCountries, dataSource]);

    return {
        data: filteredData,
        currentDataSourceInfo: currentDataSourceInfo,
    };
};

function getCurrentDataSourceInfo(dataSource: DashboardSourceInfo[], filtered: CountryContextData[]): DataSourceInfo[] {
    const periods = filtered.map(item => item.PERIODID);
    const uniquePeriods = Array.from(new Set(periods));
    return uniquePeriods.reduce((currentDataSourceInfo, period) => {
        const source = dataSource.find(source => source.DATA_YR === period);
        return source
            ? [...currentDataSourceInfo, { name: source.NAME, link: source.LINK, year: source.DATA_YR }]
            : currentDataSourceInfo;
    }, []);
}
