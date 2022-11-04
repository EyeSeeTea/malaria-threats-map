import React from "react";
import { CountryContextData } from "../../../../../../domain/entities/CountryContextData";
import { useAppContext } from "../../../../../context/app-context";

export const CountryContextDataContext = React.createContext<CountryContextState>(null);

const CountryContextDataProvider: React.FC = ({ children }) => {
    const [state, setState] = React.useState<CountryContextData[]>();
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

    return (
        <CountryContextDataContext.Provider
            value={{
                data: state,
            }}
        >
            {children}
        </CountryContextDataContext.Provider>
    );
};

export default CountryContextDataProvider;

interface CountryContextState {
    data: CountryContextData[];
}
