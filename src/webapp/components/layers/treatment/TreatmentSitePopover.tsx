import React, { Component } from "react";
import ReactDOM from "react-dom";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import { ThemeProvider } from "@material-ui/styles";
import { store, theme } from "../../../App";
import { connect, Provider } from "react-redux";
import { State } from "../../../store/types";
import mapboxgl from "mapbox-gl";
import { selectCountryMode, selectSelection } from "../../../store/reducers/base-reducer";
import TreatmentSelectionChart from "./TreatmentSelectionChart";
import { selectTreatmentFilters } from "../../../store/reducers/treatment-reducer";
import { dispatchCustomEvent } from "../../../utils/dom-utils";
import { setSelection } from "../../../store/actions/base-actions";
import { TreatmentStudy } from "../../../../domain/entities/TreatmentStudy";

const mapStateToProps = (state: State) => ({
    treatmentFilters: selectTreatmentFilters(state),
    countryMode: selectCountryMode(state),
    selection: selectSelection(state),
});

const mapDispatchToProps = {
    setSelection: setSelection,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

type OwnProps = {
    studies: TreatmentStudy[];
    map: mapboxgl.Map;
};
type Props = StateProps & DispatchProps & OwnProps;

class PreventionSitePopover extends Component<Props> {
    popup: mapboxgl.Popup;

    componentDidMount(): void {
        const placeholder = document.createElement("div");
        const { selection, studies } = this.props;
        ReactDOM.render(
            <I18nextProvider i18n={i18next}>
                <ThemeProvider theme={theme}>
                    <Provider store={store}>
                        <TreatmentSelectionChart studies={studies} />
                    </Provider>
                </ThemeProvider>
            </I18nextProvider>,
            placeholder
        );

        if (selection.coordinates) {
            this.popup = new mapboxgl.Popup()
                .setLngLat(selection.coordinates)
                .setDOMContent(placeholder)
                .addTo(this.props.map)
                .on("close", () => {
                    this.props.setSelection(null);
                });

            setTimeout(() => dispatchCustomEvent("resize"), 100);
        }
    }

    componentDidUpdate(): void {
        this.componentWillUnmount();
        this.componentDidMount();
    }

    componentWillUnmount(): void {
        if (this.popup) {
            this.popup.remove();
        }
    }

    render() {
        return <div />;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PreventionSitePopover);
