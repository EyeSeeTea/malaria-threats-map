import React, { Component } from "react";
import { connect } from "react-redux";
import mapboxgl from "mapbox-gl";
import { State } from "../../store/types";
import { selectEndemicity } from "../../store/reducers/base-reducer";

const DISPUTED_BORDERS_ENDEMICITY_LAYER_ID = "disputed-borders-endemicity-layer";
const DISPUTED_BORDERS_ENDEMICITY_SOURCE_ID = "disputed-borders-endemicity-source";

const layer: mapboxgl.FillLayer = {
    id: DISPUTED_BORDERS_ENDEMICITY_LAYER_ID,
    type: "fill",
    paint: {
        "fill-color": ["match", ["get", "NAME"], "Lakes", "#E0E8FF", "#CECECE"],
        "fill-opacity": 0.8,
        "fill-outline-color": "rgba(0,0,0,0.15)",
    },
    minzoom: 0,
    maxzoom: 20,
    source: DISPUTED_BORDERS_ENDEMICITY_SOURCE_ID,
};

const mapStateToProps = (state: State) => ({
    endemicity: selectEndemicity(state),
});

type Props = {
    map: mapboxgl.Map;
};

class DisputedBordersEndemicityLayer extends Component<Props> {
    componentDidMount(): void {
        const source: any = {
            type: "geojson",
            data: "https://services.arcgis.com/5T5nSi527N4F7luB/ArcGIS/rest/services/Detailed_Boundary_Disputed_Areas/FeatureServer/0/query?where=1%3D1&f=geojson&geometryPrecision=2.5",
        };
        if (this.props.map.getSource(DISPUTED_BORDERS_ENDEMICITY_SOURCE_ID)) {
            this.showLayer();
        } else {
            this.props.map.addSource(DISPUTED_BORDERS_ENDEMICITY_SOURCE_ID, source);
            this.props.map.addLayer(layer);
        }
    }

    componentWillUnmount(): void {
        this.hideLayer();
    }

    showLayer = () => {
        if (this.props.map.getLayer(DISPUTED_BORDERS_ENDEMICITY_LAYER_ID)) {
            this.props.map.setLayoutProperty(DISPUTED_BORDERS_ENDEMICITY_LAYER_ID, "visibility", "visible");
        }
    };

    hideLayer = () => {
        if (this.props.map.getLayer(DISPUTED_BORDERS_ENDEMICITY_LAYER_ID)) {
            this.props.map.setLayoutProperty(DISPUTED_BORDERS_ENDEMICITY_LAYER_ID, "visibility", "none");
        }
    };

    render() {
        return <div />;
    }
}

export default connect(mapStateToProps, null)(DisputedBordersEndemicityLayer);
