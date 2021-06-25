import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import { ThemeProvider } from "@material-ui/styles";
import { store, theme } from "../../../App";
import { connect, Provider } from "react-redux";
import { State } from "../../../store/types";
import mapboxgl from "mapbox-gl";
import { selectSelection } from "../../../store/reducers/base-reducer";
import { dispatchCustomEvent } from "../../../utils/dom-utils";
import { setSelection } from "../../../store/actions/base-actions";

const mapStateToProps = (state: State) => ({
    selection: selectSelection(state),
});

const mapDispatchToProps = {
    setSelection: setSelection,
};
type DispatchProps = typeof mapDispatchToProps;
type StateProps = ReturnType<typeof mapStateToProps>;

type OwnProps = {
    map: any;
};
type Props = StateProps & DispatchProps & OwnProps & { children: React.ReactNode };

const SitePopover: React.FC<Props> = ({ map, selection, setSelection, children }) => {
    useEffect(() => {
        const placeholder = document.createElement("div");
        if (!selection) {
            return;
        }

        ReactDOM.render(
            <I18nextProvider i18n={i18next}>
                <ThemeProvider theme={theme}>
                    <Provider store={store}>{children}</Provider>
                </ThemeProvider>
            </I18nextProvider>,
            placeholder
        );

        const popup = new mapboxgl.Popup()
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
        };
    });

    return <div />;
};

export default connect(mapStateToProps, mapDispatchToProps)(SitePopover);
