import React from "react";
import { CountryContextData } from "../../../../../../domain/entities/CountryContextData";
import { useAppContext } from "../../../../../context/app-context";
import { DashboardSourceInfo } from "../../../../../../domain/entities/DashboardSourceInfo";

export const CountryContextDataContext = React.createContext<CountryContextState>(null);

const CountryContextDataProvider: React.FC = ({ children }) => {
    const [state, setState] = React.useState<CountryContextData[]>();
    const [dataSourceState, setDataSourceState] = React.useState<DashboardSourceInfo[]>();
    const { compositionRoot } = useAppContext();

    React.useEffect(() => {
        compositionRoot.countryContext.get().run(
            data => {
                setState(data);
            },
            () => {
                setState([]);
            }
        );
    }, [compositionRoot]);

    React.useEffect(() => {
        compositionRoot.dashboardSourceInfo.get().run(
            data => {
                setDataSourceState(data);
            },
            () => {
                setDataSourceState([]);
            }
        );
    }, [compositionRoot]);

    return (
        <CountryContextDataContext.Provider
            value={{
                data: state,
                dataSource: dataSourceState,
            }}
        >
            {children}
        </CountryContextDataContext.Provider>
    );
};

export default CountryContextDataProvider;

interface CountryContextState {
    data: CountryContextData[];
    dataSource: DashboardSourceInfo[];
}
