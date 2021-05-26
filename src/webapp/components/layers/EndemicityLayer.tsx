import React, { Component } from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import { selectEndemicity } from "../../store/reducers/base-reducer";
import config from "../../config";

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
    endemicity: selectEndemicity(state),
});

class EndemicityLayer extends Component<any> {
    componentDidMount(): void {
        const source: any = {
            type: "geojson",
            data: `${config.mapServerUrl}/1/query?where=ENDEMICITY%3D0&f=geojson&geometryPrecision=2.5`,
        };
        this.props.map.addSource(ENDEMICITY_SOURCE_ID, source);
        this.props.map.addLayer(layer);
        if (this.props.endemicity) {
            this.showLayer();
        } else {
            this.hideLayer();
        }
    }

    componentDidUpdate() {
        if (this.props.endemicity) {
            this.showLayer();
        } else {
            this.hideLayer();
        }
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

    render() {
        return <div />;
    }
}

export default connect(mapStateToProps, null)(EndemicityLayer);
