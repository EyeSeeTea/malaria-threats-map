import React, { Component } from "react";
import { connect } from "react-redux";
import mapboxgl from "mapbox-gl";
import { State } from "../../store/types";
import { selectEndemicity } from "../../store/reducers/base-reducer";
import { CountryLayer } from "../../../domain/entities/CountryLayer";
import { selectCountryLayer } from "../../store/reducers/country-layer-reducer";
import { fetchCountryLayerRequest } from "../../store/actions/country-layer-actions";

export const PBO_ENDEMICITY_LAYER_ID = "pbo-endemicity-layer";
const PBO_ENDEMICITY_SOURCE_ID = "pbo-endemicity-source";

const layer: mapboxgl.FillLayer = {
    id: PBO_ENDEMICITY_LAYER_ID,
    type: "fill",
    paint: {
        "fill-color": "rgba(255,255,255,1)",
        "fill-opacity": 0.8,
        "fill-outline-color": "#adadad",
    },
    minzoom: 0,
    maxzoom: 20,
    source: PBO_ENDEMICITY_SOURCE_ID,
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

class PBOEndemicityLayer extends Component<Props> {
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
        if (this.props.map.getLayer(PBO_ENDEMICITY_LAYER_ID)) {
            this.props.map.setLayoutProperty(PBO_ENDEMICITY_LAYER_ID, "visibility", "visible");
        }
    };

    hideLayer = () => {
        if (this.props.map.getLayer(PBO_ENDEMICITY_LAYER_ID)) {
            this.props.map.setLayoutProperty(PBO_ENDEMICITY_LAYER_ID, "visibility", "none");
        }
    };

    private mountLayer() {
        const existing = this.props.map.getSource(PBO_ENDEMICITY_SOURCE_ID);
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

            this.props.map.addSource(PBO_ENDEMICITY_SOURCE_ID, source);
            this.props.map.addLayer(layer);
        }

        this.showLayer();
    }

    fetchCountryLayerIfRequired() {
        if (!this.props.countryLayer) {
            this.props.fetchCountryLayer();
        }
    }

    render() {
        return <div />;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PBOEndemicityLayer);

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
