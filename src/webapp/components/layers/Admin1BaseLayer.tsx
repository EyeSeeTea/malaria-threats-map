import React, { Component } from "react";
import { connect } from "react-redux";
import mapboxgl, { GeoJSONSource, GeoJSONSourceRaw } from "mapbox-gl";
import { State } from "../../store/types";
import { selectEndemicity } from "../../store/reducers/base-reducer";
import axios from "axios";
import { CountryLayer } from "../../../domain/entities/CountryLayer";

const ADMIN_1_LAYER_ID = "admin1-layer";
const ADMIN_1_SOURCE_ID = "admin1-source";

const layer: mapboxgl.LineLayer = {
    id: ADMIN_1_LAYER_ID,
    type: "line",
    paint: {
        "line-width": 1,
        "line-opacity": 0.7,
        "line-color": "#ba68c8",
    },
    minzoom: 4.5,
    maxzoom: 20,
    source: ADMIN_1_SOURCE_ID,
};

const mapStateToProps = (state: State) => ({
    endemicity: selectEndemicity(state),
});

type Props = {
    map: mapboxgl.Map;
};

class Admin1BaseLayer extends Component<Props> {
    componentDidMount(): void {
        this.props.map.getBounds();
        const source: GeoJSONSourceRaw = {
            type: "geojson",
            data: {
                type: "FeatureCollection",
                features: [],
            },
        };

        if (this.props.map.getSource(ADMIN_1_SOURCE_ID)) {
            this.showLayer();
        } else {
            this.props.map.addSource(ADMIN_1_SOURCE_ID, source);
            this.props.map.addLayer(layer);
        }

        this.props.map.on("zoomend", () => {
            if (this.props.map.getZoom() >= 4.5) {
                const zoom = this.props.map.getZoom();
                console.log("zoomend", { zoom });
                console.log("A zoom event occurred.");
                this.executeQuery();
            }
        });

        this.props.map.on("moveend", () => {
            if (this.props.map.getZoom() >= 4.5) {
                const zoom = this.props.map.getZoom();
                console.log("move", { zoom });
                console.log("A move event occurred.");
                this.executeQuery();
            }
        });
    }

    componentWillUnmount(): void {
        this.hideLayer();
    }

    showLayer = () => {
        if (this.props.map.getLayer(ADMIN_1_LAYER_ID)) {
            this.props.map.setLayoutProperty(ADMIN_1_LAYER_ID, "visibility", "visible");
        }
    };

    hideLayer = () => {
        if (this.props.map.getLayer(ADMIN_1_LAYER_ID)) {
            this.props.map.setLayoutProperty(ADMIN_1_LAYER_ID, "visibility", "none");
        }
    };

    render() {
        return <div />;
    }

    async executeQuery() {
        const geometry = this.props.map.getBounds().toArray().flat().join(",");

        const params = {
            geometry,
            geometryType: "esriGeometryEnvelope",
            inSR: 4326, // EPSG:4326 uses latitudes and longitudes
            spatialRel: "esriSpatialRelIntersects",
            f: "geojson",
            returnGeometry: true,
            outFields: "OBJECTID",
        };

        const response = await axios.get(
            "https://services.arcgis.com/5T5nSi527N4F7luB/arcgis/rest/services/Detailed_Boundary_ADM1/FeatureServer/0/query",
            { params }
        );

        (this.props.map.getSource(ADMIN_1_SOURCE_ID) as GeoJSONSource).setData(mapResponseData(response.data));
    }
}

function mapResponseData(countryLayer: CountryLayer): GeoJSON.FeatureCollection<GeoJSON.Geometry> {
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

export default connect(mapStateToProps, null)(Admin1BaseLayer);
