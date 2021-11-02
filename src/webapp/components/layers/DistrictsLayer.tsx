import React, { Component } from "react";
import { connect } from "react-redux";
import { PreventionMapType, State } from "../../store/types";
import setupEffects from "./effects";
import * as R from "ramda";
import { studySelector } from "./prevention/utils";
import { selectPreventionFilters, selectPreventionStudies } from "../../store/reducers/prevention-reducer";
import {
    PboDeploymentColors,
    PboDeploymentCountriesStatus,
} from "./prevention/PboDeployment/PboDeploymentCountriesSymbols";
import { selectDistricts, selectDistrictsLayer } from "../../store/reducers/districts-reducer";
import { selectCountryMode, selectFilters, selectRegion, selectSelection } from "../../store/reducers/base-reducer";
import { fetchDistrictsRequest } from "../../store/actions/district-actions";
import mapboxgl from "mapbox-gl";
import { buildPreventionFilters } from "./studies-filters";
import { Hidden } from "@material-ui/core";
import ChartModal from "../ChartModal";
import PreventionSelectionChart from "./prevention/PreventionSelectionChart";
import { setSelection } from "../../store/actions/base-actions";
import { PboDeploymentStatus } from "./prevention/PboDeployment/PboDeploymentSymbols";
import { PreventionStudy } from "../../../domain/entities/PreventionStudy";
import SitePopover from "./common/SitePopover";

const DISTRICTS_LAYER_ID = "districts-layer";
const DISTRICTS_SOURCE_ID = "districts-source";

const layer: mapboxgl.FillLayer = {
    id: DISTRICTS_LAYER_ID,
    type: "fill",
    paint: {
        "fill-color": [
            "match",
            ["get", "PBO_DEPLOYMENT_STATUS"],
            PboDeploymentCountriesStatus.ELIGIBLE,
            PboDeploymentColors[PboDeploymentCountriesStatus.ELIGIBLE][0],
            PboDeploymentCountriesStatus.NOT_ELIGIBLE,
            PboDeploymentColors[PboDeploymentCountriesStatus.NOT_ELIGIBLE][0],
            PboDeploymentCountriesStatus.NOT_ENOUGH_DATA,
            PboDeploymentColors[PboDeploymentCountriesStatus.NOT_ENOUGH_DATA][0],
            PboDeploymentColors[PboDeploymentCountriesStatus.NOT_APPLICABLE][0],
        ],
        "fill-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 0.5, 0.7],
        "fill-outline-color": "rgba(0,0,0,0.1)",
    },
    minzoom: 0,
    maxzoom: 20,
    source: DISTRICTS_SOURCE_ID,
};

const mapStateToProps = (state: State) => ({
    region: selectRegion(state),
    districts: selectDistricts(state),
    layer: selectDistrictsLayer(state),
    studies: selectPreventionStudies(state),
    preventionFilters: selectPreventionFilters(state),
    filters: selectFilters(state),
    countryMode: selectCountryMode(state),
    selection: selectSelection(state),
});

const mapDispatchToProps = {
    fetchDistricts: fetchDistrictsRequest,
    setSelection: setSelection,
};

type OwnProps = {
    map: mapboxgl.Map;
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps & OwnProps;

class CountrySelectorLayer extends Component<Props> {
    componentDidMount() {
        const { region, fetchDistricts } = this.props;
        if (region.country) {
            fetchDistricts(region.country);
        }
    }

    componentDidUpdate(prevProps: Props) {
        const { region, districts, studies, fetchDistricts, countryMode } = this.props;
        if (region.country && region.country !== prevProps.region.country) {
            fetchDistricts(region.country);
        }
        if (countryMode && districts.length && studies.length) {
            if (region.country) {
                this.mountLayer();
            } else {
                const data: any = {
                    type: "FeatureCollection",
                    features: [],
                };
                const existing: any = this.props.map.getSource(DISTRICTS_SOURCE_ID);
                if (existing) {
                    existing.setData(data);
                }
            }
        }
    }

    buildFilters = () => {
        const { preventionFilters, filters, region } = this.props;
        return buildPreventionFilters(preventionFilters, filters, region);
    };

    filterStudies = (studies: PreventionStudy[]) => {
        const filters = this.buildFilters();
        return filters.reduce((studies, filter) => studies.filter(filter), studies);
    };

    mountLayer = () => {
        const studies = this.filterStudies(this.props.studies);
        const groupedStudies = R.groupBy(
            R.path<string>(["SITE_ID"]),
            studies
        );
        const filteredStudies = R.values(groupedStudies).map(group =>
            studySelector(group, PreventionMapType.PBO_DEPLOYMENT)
        );

        const studiesByDistrict = R.groupBy(
            R.path<string>(["ADMIN2_GUID"]),
            filteredStudies
        );

        const { ELIGIBLE, NOT_ENOUGH_DATA, NOT_ELIGIBLE } = PboDeploymentCountriesStatus;

        const filterByStatus = (status: PboDeploymentCountriesStatus) => (studies: any[]) =>
            studies.filter(s => s.PBO_DEPLOYMENT_STATUS === status);

        const statusByDistrict: { [key: string]: any } = Object.entries(studiesByDistrict).reduce(
            (acc, [key, studies]) => ({
                ...acc,
                [key]: {
                    [ELIGIBLE]: filterByStatus(ELIGIBLE)(studies).length,
                    [NOT_ENOUGH_DATA]: filterByStatus(NOT_ENOUGH_DATA)(studies).length,
                    [NOT_ELIGIBLE]: filterByStatus(NOT_ELIGIBLE)(studies).length,
                },
            }),
            {}
        );

        const features = this.props.layer.features.map((feature: any) => {
            const newFeature = { ...feature };
            const districtStatus: { [key: string]: number } = statusByDistrict[newFeature.properties.GUID];
            if (!districtStatus) {
                newFeature.properties.PBO_DEPLOYMENT_STATUS = null;
                return newFeature;
            }
            const statuses: Record<string, number> = Object.entries(districtStatus).reduce(
                (acc, [key, value]) => ({ ...acc, [key]: value }),
                {}
            );

            const isGreen = statuses[PboDeploymentStatus.ELIGIBLE] > 0;
            newFeature.properties.PBO_DEPLOYMENT_STATUS = isGreen
                ? PboDeploymentStatus.ELIGIBLE
                : PboDeploymentStatus.NOT_ENOUGH_DATA;

            return newFeature;
        });

        const data: GeoJSON.FeatureCollection = {
            type: "FeatureCollection",
            features,
        };

        const existing: mapboxgl.GeoJSONSource = this.props.map.getSource(
            DISTRICTS_SOURCE_ID
        ) as mapboxgl.GeoJSONSource;
        if (existing) {
            existing.setData(data);
            this.showLayer();
            return;
        } else {
            const source: any = {
                type: "geojson",
                data: data,
            };
            this.props.map.addSource(DISTRICTS_SOURCE_ID, source);
            this.props.map.addLayer(layer);
            setupEffects(this.props.map, DISTRICTS_SOURCE_ID, DISTRICTS_LAYER_ID);
            this.setupPopover();
            this.showLayer();
        }
    };

    componentWillUnmount(): void {
        this.hideLayer();
    }

    showLayer = () => {
        if (this.props.map.getLayer(DISTRICTS_LAYER_ID)) {
            this.props.map.setLayoutProperty(DISTRICTS_LAYER_ID, "visibility", "visible");
        }
    };

    hideLayer = () => {
        if (this.props.map.getLayer(DISTRICTS_LAYER_ID)) {
            this.props.map.setLayoutProperty(DISTRICTS_LAYER_ID, "visibility", "none");
        }
    };

    onClickListener = (e: any) => {
        const coordinates = [e.features[0].properties.CENTER_LON, e.features[0].properties.CENTER_LAT] as [
            number,
            number
        ];
        const selection = {
            ISO_2_CODE: e.features[0].properties.ISO_2_CODE,
            SITE_ID: e.features[0].properties.GUID,
            coordinates: coordinates,
        };
        setTimeout(() => {
            this.props.setSelection(selection);
        }, 100);
    };

    setupPopover = () => {
        this.props.map.off("click", DISTRICTS_LAYER_ID, this.onClickListener);
        this.props.map.on("click", DISTRICTS_LAYER_ID, this.onClickListener);
    };

    render() {
        const { studies, selection } = this.props;
        if (selection === null) {
            return <div />;
        }
        const filteredStudies = this.filterStudies(studies).filter(study => study.ADMIN2_GUID === selection.SITE_ID);
        if (filteredStudies.length === 0) {
            return <div />;
        }
        return (
            <>
                <Hidden xsDown>
                    <SitePopover map={this.props.map}>
                        <PreventionSelectionChart studies={filteredStudies} />
                    </SitePopover>
                </Hidden>
                <Hidden smUp>
                    <ChartModal selection={selection}>
                        <PreventionSelectionChart studies={filteredStudies} />
                    </ChartModal>
                </Hidden>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CountrySelectorLayer);
