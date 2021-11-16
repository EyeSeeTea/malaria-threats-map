import React, { Component } from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import { selectEndemicity } from "../../store/reducers/base-reducer";
import { selectCountryLayer } from "../../store/reducers/country-layer-reducer";
import { CountryLayer } from "../../../domain/entities/CountryLayer";
import { fetchCountryLayerRequest } from "../../store/actions/country-layer-actions";

const ENDEMICITY_LAYER_ID = "endemicity-layer";
const ENDEMICITY_SOURCE_ID = "endemicity-source";

const layer: mapboxgl.FillLayer = {
    id: ENDEMICITY_LAYER_ID,
    type: "fill",
    paint: {
        "fill-color": "rgba(0,0,0,0.4)",
        "fill-opacity": 0.5,
        "fill-outline-color": "rgba(0,0,0,0.1)",
    },
    minzoom: 0,
    maxzoom: 20,
    source: ENDEMICITY_SOURCE_ID,
};

const mapStateToProps = (state: State) => ({
    countryLayer: selectCountryLayer(state),
    endemicity: selectEndemicity(state),
});

const mapDispatchToProps = {
    fetchCountryLayer: fetchCountryLayerRequest,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

type OwnProps = {
    map: mapboxgl.Map;
};
type Props = StateProps & DispatchProps & OwnProps;

class EndemicityLayer extends Component<Props> {
    componentDidMount() {
        this.fetchCountryLayerIfRequired();
        this.mountLayer();
    }

    componentDidUpdate() {
        this.fetchCountryLayerIfRequired();
        this.mountLayer();
    }

    componentWillUnmount(): void {
        this.hideLayer();
    }

    showLayer = () => {
        if (this.props.map.getLayer(ENDEMICITY_LAYER_ID)) {
            this.props.map.setLayoutProperty(ENDEMICITY_LAYER_ID, "visibility", "visible");
        }
    };

    hideLayer = () => {
        if (this.props.map.getLayer(ENDEMICITY_LAYER_ID)) {
            this.props.map.setLayoutProperty(ENDEMICITY_LAYER_ID, "visibility", "none");
        }
    };

    private mountLayer() {
        const existing = this.props.map.getSource(ENDEMICITY_SOURCE_ID);
        if (!existing && this.props.countryLayer) {
            const countryLayer: CountryLayer = this.props.countryLayer;

            const noEndemicCountryLayer = mapCountryLayer({
                ...countryLayer,
                features: countryLayer.features.filter(feature => feature.properties.ENDEMICITY === 0),
            });

            const source: any = {
                type: "geojson",
                data: noEndemicCountryLayer,
            };

            this.props.map.addSource(ENDEMICITY_SOURCE_ID, source);
            this.props.map.addLayer(layer);
        }

        if (this.props.endemicity) {
            this.showLayer();
        } else {
            this.hideLayer();
        }
    }

    fetchCountryLayerIfRequired() {
        if (!this.props.countryLayer && this.props.endemicity) {
            this.props.fetchCountryLayer();
        }
    }

    render() {
        return <div />;
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(EndemicityLayer);

function mapCountryLayer(countryLayer: CountryLayer): GeoJSON.FeatureCollection<GeoJSON.Geometry> {
    return {
        type: "FeatureCollection",
        features: countryLayer.features.map(feature => {
            return {
                type: "Feature",
                id: feature.id,
                geometry: feature.geometry,
                properties: feature.properties,
            };
        }),
    };
}
