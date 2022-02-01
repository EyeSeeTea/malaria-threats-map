import React, { Component } from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import { selectRegion } from "../../store/reducers/base-reducer";

const MEKONG_LAYER_ID = "mekong-layer";
const MEKONG_SOURCE_ID = "mekong-source";

const layer: mapboxgl.FillLayer = {
    id: MEKONG_LAYER_ID,
    type: "fill",
    paint: {
        "fill-color": "rgba(0,0,0,0.3)",
        "fill-opacity": 0.3,
        "fill-outline-color": "rgba(0,0,0,0.0)",
    },
    minzoom: 0,
    maxzoom: 20,
    source: MEKONG_SOURCE_ID,
};

const mapStateToProps = (state: State) => ({
    region: selectRegion(state),
});

const detailed_Boundary_ADM1 =
    "https://services.arcgis.com/5T5nSi527N4F7luB/arcgis/rest/services/Detailed_Boundary_ADM2/FeatureServer/2";

class MekongLayer extends Component<any> {
    componentDidMount(): void {
        const { region } = this.props;
        const source: any = {
            type: "geojson",
            data: `${detailed_Boundary_ADM1}/query?where=iso_2_code='CN' AND ADM1_NAME<>'yunnan'&f=geojson`,
        };
        this.props.map.addSource(MEKONG_SOURCE_ID, source);
        this.props.map.addLayer(layer);
        if (region && region.subRegion === "GREATER_MEKONG") {
            this.showLayer();
        } else {
            this.hideLayer();
        }
    }

    componentDidUpdate() {
        const { region } = this.props;
        if (region && region.subRegion === "GREATER_MEKONG") {
            this.showLayer();
        } else {
            this.hideLayer();
        }
    }

    componentWillUnmount(): void {
        this.hideLayer();
    }

    showLayer = () => {
        if (this.props.map.getLayer(MEKONG_LAYER_ID)) {
            this.props.map.setLayoutProperty(MEKONG_LAYER_ID, "visibility", "visible");
        }
    };

    hideLayer = () => {
        if (this.props.map.getLayer(MEKONG_LAYER_ID)) {
            this.props.map.setLayoutProperty(MEKONG_LAYER_ID, "visibility", "none");
        }
    };

    render() {
        return <div />;
    }
}

export default connect(mapStateToProps, null)(MekongLayer);
