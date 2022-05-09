import React from "react";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import { Provider } from "react-redux";
import createStore from "./store";
import DataProvider from "./components/DataProvider";
import { Theme, StyledEngineProvider, responsiveFontSizes } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Router } from "./pages/Router";

declare module "@mui/styles/defaultTheme" {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface DefaultTheme extends Theme {}
}

export const { store } = createStore();

export let theme = createTheme({
    palette: {
        primary: {
            main: "#2fb3af",
        },
        secondary: {
            main: "#d86422",
        },
        grey: {
            // This is the unique simple approach in @mui v5 to change default and hover fab background-color
            // set by theme, styled or makeStyles provoke color errors to assign color to primary
            300: "#FFFFFF",
            A100: "#e0e0e0",
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    fontSize: "0.875rem",
                    lineHeight: 1.43,
                    letterSpacing: "0.01071em",
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: "standard",
            },
        },
        MuiFormControl: {
            defaultProps: {
                variant: "standard",
            },
        },
        MuiSelect: {
            defaultProps: {
                variant: "standard",
            },
        },
        MuiLink: {
            defaultProps: {
                underline: "hover",
            },
        },
    },
});

theme = responsiveFontSizes(theme); 

class App extends React.Component {
    render() {
        return (
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={theme}>
                    <Provider store={store}>
                        <DataProvider>
                            <I18nextProvider i18n={i18next}>
                                <Router />
                            </I18nextProvider>
                        </DataProvider>
                    </Provider>
                </ThemeProvider>
            </StyledEngineProvider>
        );
    }
}

export default App;
