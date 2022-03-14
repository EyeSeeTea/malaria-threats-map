import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import { ThemeProvider } from "@mui/material/styles";
import { store, theme } from "../../../App";
import { connect, Provider } from "react-redux";
import { State } from "../../../store/types";
import mapboxgl from "mapbox-gl";
import { selectSelection } from "../../../store/reducers/base-reducer";
import { dispatchCustomEvent } from "../../../utils/dom-utils";
import { setSelection, setTooltipOpen } from "../../../store/actions/base-actions";
import { StyledEngineProvider, Theme } from "@mui/material";

declare module "@mui/styles/defaultTheme" {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface DefaultTheme extends Theme {}
}

const mapStateToProps = (state: State) => ({
    selection: selectSelection(state),
});

const mapDispatchToProps = {
    setSelection: setSelection,
    setTooltipOpen: setTooltipOpen,
};
type DispatchProps = typeof mapDispatchToProps;
type StateProps = ReturnType<typeof mapStateToProps>;

type OwnProps = {
    map: any;
};
type Props = StateProps & DispatchProps & OwnProps & { children: React.ReactNode };

const SitePopover: React.FC<Props> = ({ map, selection, setSelection, children, setTooltipOpen }) => {
    useEffect(() => {
        const placeholder = document.createElement("div");
        if (!selection) {
            return;
        }

        ReactDOM.render(
            <I18nextProvider i18n={i18next}>
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={theme}>
                        <Provider store={store}>{children}</Provider>
                    </ThemeProvider>
                </StyledEngineProvider>
            </I18nextProvider>,
            placeholder
        );

        const popup = new mapboxgl.Popup({ closeOnClick: true })
            .setLngLat(selection.coordinates)
            .setDOMContent(placeholder)
            .addTo(map)
            .on("close", () => {
                setSelection(null);
            });

        setTimeout(() => dispatchCustomEvent("resize"), 100);

        return () => {
            ReactDOM.unmountComponentAtNode(placeholder);
            popup.remove();
            //setTooltipOpen(false);
        };
    });

    return <div />;
};

export default connect(mapStateToProps, mapDispatchToProps)(SitePopover);
