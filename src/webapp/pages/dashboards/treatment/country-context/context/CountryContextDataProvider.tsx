import React from "react";
import { CountryContextData } from "../../../../../../domain/entities/CountryContextData";

export const CountryContextDataContext = React.createContext<CountryContextState>(null);

const CountryContextDataProvider: React.FC = ({ children }) => {
    const [state, setState] = React.useState<CountryContextData[]>();

    return (
        <CountryContextDataContext.Provider
            value={{
                data: state,
                setData: setState,
            }}
        >
            {children}
        </CountryContextDataContext.Provider>
    );
};

export default CountryContextDataProvider;

interface CountryContextState {
    data: CountryContextData[];
    setData: (data: CountryContextData[]) => void;
}
