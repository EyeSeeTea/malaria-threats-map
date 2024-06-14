import React, { Component } from "react";
import { connect } from "react-redux";
import mapboxgl from "mapbox-gl";
import { RegionState, State } from "../../store/types";
import * as R from "ramda";
import { selectCountryLayer } from "../../store/reducers/country-layer-reducer";
import { selectRegion } from "../../store/reducers/base-reducer";
import { setSelection } from "../../store/actions/base-actions";
import { CountryLayer } from "../../../domain/entities/CountryLayer";

const REGION_LAYER_ID = "regions-layer";
const REGION_SOURCE_ID = "regions-source";

const layer: mapboxgl.FillLayer = {
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
    minzoom: 0,
    maxzoom: 20,
    source: REGION_SOURCE_ID,
};

const mapStateToProps = (state: State) => ({
    region: selectRegion(state),
    countryLayer: selectCountryLayer(state),
});

const mapDispatchToProps = {
    setSelection: setSelection,
};

interface OwnProps {
    map: mapboxgl.Map;
}

const MEKONG_BOUNDS: [number, number, number, number] = [
    65.39066990951679, -1.6114593755411022, 146.6850042235456, 45.83706104249836,
];

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps & OwnProps;

class RegionLayer extends Component<Props> {
    componentDidUpdate(prevProps: Props) {
        const existing = this.props.map.getSource(REGION_SOURCE_ID);
        if (!existing && this.props.countryLayer) {
            const mapboxSource = mapCountryLayer(this.props.countryLayer);

            this.props.map.addSource(REGION_SOURCE_ID, {
                type: "geojson",
                data: mapboxSource,
            });
            this.props.map.addLayer(layer);
        }

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
            region.site && this.zoomToSite(region.siteCoordinates, region.changeZoomToSite);
        } else if (region.subRegion) {
            this.zoomToSubRegion(region.subRegion);
            this.highlightToSubRegion(region.subRegion);
            this.showLayer();
        } else if (region.region) {
            this.zoomToRegion(region.region);
            this.highlightToRegion(region.region);
            this.showLayer();
        } else if (region.site) {
            this.zoomToSite(region.siteCoordinates, region.changeZoomToSite);
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
        const manualBounds: Record<string, mapboxgl.LngLatBounds> = {
            RU: new mapboxgl.LngLatBounds(
                { lng: 9.581379539867555, lat: 31.394361299606373 },
                { lng: 227.99459783721954, lat: 82.57887256921276 }
            ),
            US: new mapboxgl.LngLatBounds(
                { lng: -195.90829039443304, lat: 13.707605258632569 },
                { lng: 21.522878407466067, lat: 79.52810148835542 }
            ),
        };
        const bounds =
            country in manualBounds
                ? manualBounds[country]
                : coordinates.reduce((bounds: any, coord: any) => {
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

        const manualBounds: Record<string, mapboxgl.LngLatBounds> = {
            EUROPE: new mapboxgl.LngLatBounds(
                { lng: 221.51049804341602, lat: 83.14945739166231 },
                { lng: -39.31141982332926, lat: 13.554006098541365 }
            ),
            AMERICAS: new mapboxgl.LngLatBounds(
                { lng: -153.98461604374486, lat: -56.52632713139387 },
                { lng: 2.3584705053495725, lat: 31.8801890706726 }
            ),
            WESTERN_PACIFIC: new mapboxgl.LngLatBounds(
                { lng: 83.4316294942189, lat: -17.017362810518364 },
                { lng: 189.60236725036026, lat: 46.287698110511286 }
            ),
        };
        const bounds =
            region in manualBounds
                ? manualBounds[region]
                : coordinates.reduce((bounds: any, coord: any) => {
                      return bounds.extend(coord);
                  }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
        this.props.map.fitBounds(bounds, {
            padding: region === "AMERICAS" || region === "WESTERN_PACIFIC" ? 0 : 100,
        });
    };

    zoomToSubRegion = (subRegion: string) => {
        const { countryLayer } = this.props;
        if (subRegion === "GREATER_MEKONG") {
            this.props.map.fitBounds(MEKONG_BOUNDS);
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

    zoomToSite = (coords: [number, number], changeZoomToSite: boolean) => {
        const currentZoom = this.props.map.getZoom();
        const coordinates: [number, number] = [coords[1], coords[0]];

        this.props.map.flyTo({
            center: coordinates,
            zoom: changeZoomToSite ? 5 : currentZoom,
            essential: true,
            maxDuration: 5000,
            speed: 0.5,
            padding: { top: 200, bottom: 0, left: 0, right: 350 },
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
