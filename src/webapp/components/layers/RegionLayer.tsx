import React, { Component } from "react";
import { connect } from "react-redux";
import mapboxgl from "mapbox-gl";
import { RegionState, State } from "../../store/types";
import * as R from "ramda";
import { fetchCountryLayerRequest } from "../../store/actions/country-layer-actions";
import { selectCountryLayer } from "../../store/reducers/country-layer-reducer";
import { selectEndemicity, selectRegion } from "../../store/reducers/base-reducer";
import { MapServerConfig } from "../../constants/constants";
import config from "../../config";
import { setRegionAction, setSelection } from "../../store/actions/base-actions";

const REGION_LAYER_ID = "regions-layer";
const REGION_SOURCE_ID = "regions-source";

const layer: any = {
    id: REGION_LAYER_ID,
    type: "fill",
    paint: {
        "fill-color": "rgba(0,0,0,0.4)",
        "fill-opacity": 0.5,
        "fill-outline-color": "rgba(0,0,0,0.1)",
    },
    layout: {
        visibility: "none",
    },
    minZoom: 0,
    maxZoom: 20,
    source: REGION_SOURCE_ID,
};

const mapStateToProps = (state: State) => ({
    endemicity: selectEndemicity(state),
    region: selectRegion(state),
    countryLayer: selectCountryLayer(state),
});

const mapDispatchToProps = {
    fetchCountryLayer: fetchCountryLayerRequest,
    setSelection: setSelection,
    setRegion: setRegionAction,
};

interface OwnProps {
    map: any;
}

const MEKONG_BOUNDS: [number, number, number, number] = [
    71.67568318434894,
    -10.1059286413618565,
    129.04037704012393,
    38.602914952002706,
];

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps & OwnProps;

class RegionLayer extends Component<Props> {
    componentDidMount(): void {
        const { fetchCountryLayer } = this.props;
        fetchCountryLayer();
        const query =
            "where=1%3D1&f=geojson&geometryPrecision=2.5&outFields=SUBREGION,REGION_FULL,CENTER_LAT,CENTER_LON,ISO_2_CODE";
        const source: any = {
            type: "geojson",
            data: `${config.mapServerUrl}/${MapServerConfig.layers.countries}/query?${query}`,
        };
        const existing = this.props.map.getSource(REGION_SOURCE_ID);
        if (!existing) {
            this.props.map.addSource(REGION_SOURCE_ID, source);
            this.props.map.addLayer(layer);
        }
    }

    componentDidUpdate(prevProps: Props) {
        const { region, countryLayer } = this.props;
        if (prevProps.region !== region) {
            this.applyCountryUpdates(region);
        }
        if (prevProps.countryLayer !== countryLayer) {
            this.applyCountryUpdates(region);
        }
    }

    applyCountryUpdates = (region: RegionState) => {
        if (region.country) {
            this.zoomToCountry(region.country);
            this.highlightToCountry(region.country);
            this.showLayer();
        } else if (region.subRegion) {
            this.zoomToSubRegion(region.subRegion);
            this.highlightToSubRegion(region.subRegion);
            this.showLayer();
        } else if (region.region) {
            this.zoomToRegion(region.region);
            this.highlightToRegion(region.region);
            this.showLayer();
        } else if (region.site) {
            this.zoomToSite(region.site, region.siteIso2, region.siteCoordinates);
        } else {
            this.hideLayer();
        }
    };

    highlightToCountry = (country: string) => {
        this.props.map.setFilter(REGION_LAYER_ID, ["all", ["!=", "ISO_2_CODE", country]]);
    };

    highlightToRegion = (region: string) => {
        this.props.map.setFilter(REGION_LAYER_ID, ["all", ["!=", "REGION_FULL", region.replace(/_/g, " ")]]);
    };

    highlightToSubRegion = (subRegion: string) => {
        this.props.map.setFilter(REGION_LAYER_ID, ["all", ["!=", "SUBREGION", subRegion.replace(/_/g, " ")]]);
    };

    zoomToCountry = (country: string) => {
        const { countryLayer } = this.props;
        if (!countryLayer) return;
        const feature = countryLayer.features.find(
            (feature: any) => feature.properties.ADM0_NAME === country || feature.properties.ISO_2_CODE === country
        );
        if (!feature) return;
        const coordinates: any[] = R.chain((coords: any) => {
            return coords[0].length === 2 ? coords : coords[0];
        }, feature.geometry.coordinates);
        const bounds = coordinates.reduce((bounds: any, coord: any) => {
            return bounds.extend(coord);
        }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
        this.props.map.fitBounds(bounds, {
            padding: 100,
        });
    };

    zoomToRegion = (region: string) => {
        const { countryLayer } = this.props;
        if (!countryLayer) return;
        const features = countryLayer.features.filter((feature: any) => {
            return (
                feature.properties.REGION_FULL === region ||
                feature.properties.REGION_FULL === region.replace(/_/g, " ")
            );
        });
        if (!features.length) return;
        const coordinates: any[] = features.reduce((acc: any[], feature: any) => {
            const featureCoords = R.chain((coords: any) => {
                return coords[0].length === 2 ? coords : coords[0];
            }, feature.geometry.coordinates);
            return [...acc, ...featureCoords];
        }, []);
        const bounds = coordinates.reduce((bounds: any, coord: any) => {
            return bounds.extend(coord);
        }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
        this.props.map.fitBounds(bounds, {
            padding: 100,
        });
    };

    zoomToSubRegion = (subRegion: string) => {
        const { countryLayer } = this.props;
        if (subRegion === "GREATER_MEKONG") {
            this.props.map.fitBounds(MEKONG_BOUNDS, {
                padding: 100,
            });
            return;
        }
        if (!countryLayer) return;
        const features = countryLayer.features.filter((feature: any) => {
            return (
                feature.properties.SUBREGION === subRegion ||
                feature.properties.SUBREGION === subRegion.replace(/_/g, " ")
            );
        });
        if (!features.length) return;
        const coordinates: any[] = features.reduce((acc: any[], feature: any) => {
            const featureCoords = R.chain((coords: any) => {
                return coords[0].length === 2 ? coords : coords[0];
            }, feature.geometry.coordinates);
            return [...acc, ...featureCoords];
        }, []);
        const bounds = coordinates.reduce((bounds: any, coord: any) => {
            return bounds.extend(coord);
        }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
        this.props.map.fitBounds(bounds, {
            padding: 100,
        });
    };

    zoomToSite = (site: string, iso2: string, coords: [number, number]) => {
        const coordinates: [number, number] = [coords[1], coords[0]];

        this.props.map.once("moveend", ({ _originalEvent }: any) => {
            const selection = {
                ISO_2_CODE: iso2,
                SITE_ID: site,
                coordinates: coordinates,
            };
            setTimeout(() => {
                this.props.setSelection(selection);
            }, 100);
        });
        this.props.map.flyTo({
            center: coordinates,
            zoom: 20,
            essential: true,
            maxDuration: 5000,
        });
    };

    componentWillUnmount(): void {
        this.hideLayer();
    }

    showLayer = () => {
        if (this.props.map.getLayer(REGION_LAYER_ID)) {
            this.props.map.setLayoutProperty(REGION_LAYER_ID, "visibility", "visible");
        }
    };

    hideLayer = () => {
        if (this.props.map.getLayer(REGION_LAYER_ID)) {
            this.props.map.setLayoutProperty(REGION_LAYER_ID, "visibility", "none");
        }
    };

    render() {
        return <div />;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegionLayer);
