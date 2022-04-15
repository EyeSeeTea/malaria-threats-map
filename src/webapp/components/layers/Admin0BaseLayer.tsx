import React, { Component } from "react";
import { connect } from "react-redux";
import mapboxgl from "mapbox-gl";
import { State } from "../../store/types";
import { selectEndemicity } from "../../store/reducers/base-reducer";

const ADMIN_0_LAYER_ID = "admin0-layer";
const ADMIN_0_SOURCE_ID = "admin0-source";

const layer: mapboxgl.LineLayer = {
    id: ADMIN_0_LAYER_ID,
    type: "line",
    paint: {
        "line-width": 1,
        "line-opacity": 0.9,
        "line-color": "#f06292",
    },
    minzoom: 0,
    maxzoom: 20,
    source: ADMIN_0_SOURCE_ID,
};

const mapStateToProps = (state: State) => ({
    endemicity: selectEndemicity(state),
});

type Props = {
    map: mapboxgl.Map;
};

class Admin0BaseLayer extends Component<Props> {
    componentDidMount(): void {
        const source: any = {
            type: "geojson",
            data:
                "https://services.arcgis.com/5T5nSi527N4F7luB/arcgis/rest/services/Detailed_Boundary_ADM0/FeatureServer/0/query?where=1%3D1&f=geojson",
        };
        if (this.props.map.getSource(ADMIN_0_SOURCE_ID)) {
            this.showLayer();
        } else {
            this.props.map.addSource(ADMIN_0_SOURCE_ID, source);
            this.props.map.addLayer(layer);
        }
    }

    componentWillUnmount(): void {
        this.hideLayer();
    }

    showLayer = () => {
        if (this.props.map.getLayer(ADMIN_0_LAYER_ID)) {
            this.props.map.setLayoutProperty(ADMIN_0_LAYER_ID, "visibility", "visible");
        }
    };

    hideLayer = () => {
        if (this.props.map.getLayer(ADMIN_0_LAYER_ID)) {
            this.props.map.setLayoutProperty(ADMIN_0_LAYER_ID, "visibility", "none");
        }
    };

    render() {
        return <div />;
    }
}

export default connect(mapStateToProps, null)(Admin0BaseLayer);
