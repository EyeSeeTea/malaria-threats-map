import React, { Component } from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import { selectRegion } from "../../store/reducers/base-reducer";
import mapboxgl, { RasterSource } from "mapbox-gl";

const LABELS_LAYER_ID = "labels-layer";
const LABELS_SOURCE_ID = "labels-source";

const layer: mapboxgl.AnyLayer = {
    id: LABELS_LAYER_ID,
    type: "raster",
    source: LABELS_SOURCE_ID,
    minzoom: 1,
    maxzoom: 8,
};

const mapStateToProps = (state: State) => ({
    region: selectRegion(state),
});

type OwnProps = {
    map: mapboxgl.Map;
};

type StateProps = ReturnType<typeof mapStateToProps>;
type Props = StateProps & OwnProps;

class LabelsLayer extends Component<Props> {
    componentDidMount() {
        const source: RasterSource = {
            type: "raster",
            tiles: [
                `https://maps.who.int/arcgis/rest/services/Basemap/WHO_Reference_layer/MapServer/tile/{z}/{y}/{x}?blankTile=false`,
            ],
            tileSize: 256,
            attribution: "",
        };
        this.props.map.addSource(LABELS_SOURCE_ID, source);
        this.props.map.addLayer(layer);
        this.showLayer();
    }

    componentWillUnmount(): void {
        this.hideLayer();
    }

    showLayer = () => {
        if (this.props.map.getLayer(LABELS_LAYER_ID)) {
            this.props.map.setLayoutProperty(LABELS_LAYER_ID, "visibility", "visible");
        }
    };

    hideLayer = () => {
        if (this.props.map.getLayer(LABELS_LAYER_ID)) {
            this.props.map.setLayoutProperty(LABELS_LAYER_ID, "visibility", "none");
        }
    };

    render() {
        return <div />;
    }
}

export default connect(mapStateToProps, null)(LabelsLayer);
