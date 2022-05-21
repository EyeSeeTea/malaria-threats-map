import React, { Component } from "react";
import { connect } from "react-redux";
import { InvasiveMapType, State } from "../../../store/types";
import { studiesToGeoJson } from "../layer-utils";
import setupEffects from "../effects";
import { selectFilters, selectHoverSelection, selectRegion, selectTheme } from "../../../store/reducers/base-reducer";
import mapboxgl from "mapbox-gl";
import * as R from "ramda";
import { filterByRegion, filterByVectorSpecies, filterByYearRange } from "../studies-filters";
import { resolveMapTypeSymbols, studySelector } from "./utils";
import { selectInvasiveFilters, selectInvasiveStudies } from "../../../store/reducers/invasive-reducer";
import { setInvasiveFilteredStudiesAction, setInvasiveSelectionStudies } from "../../../store/actions/invasive-actions";
import { setHoverSelection, setSelection } from "../../../store/actions/base-actions";
import { fetchInvasiveStudiesRequest } from "../../../store/actions/invasive-actions";
import { InvasiveStudy } from "../../../../domain/entities/InvasiveStudy";
import SitePopover from "../common/SitePopover";
import Hidden from "../../hidden/Hidden";
import SiteTitle from "../../site-title/SiteTitle";
import { getSiteSelectionOnClick, getSiteSelectionOnMove } from "../common/utils";

const INVASIVE = "invasive";
const INVASIVE_LAYER_ID = "invasive-layer";
const INVASIVE_SOURCE_ID = "invasive-source";

const circleLayout = {
    visibility: "visible",
};

const layer: any = (symbols: any) => ({
    id: INVASIVE_LAYER_ID,
    type: "circle",
    layout: circleLayout,
    paint: symbols,
    source: INVASIVE_SOURCE_ID,
});

const mapStateToProps = (state: State) => ({
    studies: selectInvasiveStudies(state),
    theme: selectTheme(state),
    filters: selectFilters(state),
    invasiveFilters: selectInvasiveFilters(state),
    region: selectRegion(state),
    hoverSelection: selectHoverSelection(state),
});

const mapDispatchToProps = {
    fetchInvasiveStudies: fetchInvasiveStudiesRequest,
    setFilteredStudies: setInvasiveFilteredStudiesAction,
    setSelection: setSelection,
    setHoverSelection: setHoverSelection,
    setInvasiveSelectionStudies: setInvasiveSelectionStudies,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

type OwnProps = {
    map: mapboxgl.Map;
};
type Props = StateProps & OwnProps & DispatchProps;

class InvasiveLayer extends Component<Props> {
    popup: mapboxgl.Popup;
    componentDidMount() {
        this.loadStudiesIfRequired();
        this.mountLayer();
    }

    componentDidUpdate(prevProps: Props) {
        this.loadStudiesIfRequired();

        const {
            invasiveFilters: { mapType, vectorSpecies },
            filters,
            region,
        } = this.props;

        this.mountLayer(prevProps);
        this.renderLayer();
        const mapTypeChange = prevProps.invasiveFilters.mapType !== mapType;
        const yearChange = prevProps.filters[0] !== filters[0] || prevProps.filters[1] !== filters[1];
        const countryChange = prevProps.region !== region;
        const speciesChange = prevProps.invasiveFilters.vectorSpecies.length !== vectorSpecies.length;
        if (mapTypeChange || yearChange || countryChange || speciesChange) {
            if (this.popup) {
                this.popup.remove();
            }
            this.filterSource();
            this.applyMapTypeSymbols();
        }
    }

    loadStudiesIfRequired() {
        const { theme } = this.props;

        if (theme === INVASIVE) {
            this.props.fetchInvasiveStudies();
        }
    }

    componentWillUnmount() {
        this.renderLayer();
    }

    setupGeoJsonData = (studies: any[]) => {
        const { mapType } = this.props.invasiveFilters;
        const groupedStudies = R.groupBy(R.path<string>(["SITE_ID"]), studies);
        const filteredStudies = R.values(groupedStudies).map(group => studySelector(group, mapType));
        return filteredStudies;
    };

    buildFilters = () => {
        const { invasiveFilters, filters, region } = this.props;
        switch (invasiveFilters.mapType) {
            case InvasiveMapType.VECTOR_OCCURANCE:
                return [
                    filterByVectorSpecies(invasiveFilters.vectorSpecies),
                    filterByYearRange(filters, true),
                    filterByRegion(region),
                ];
            default:
                return [filterByRegion(region)];
        }
    };

    filterStudies = (studies: InvasiveStudy[]) => {
        const filters = this.buildFilters();
        return filters.reduce((studies, filter) => studies.filter(filter), studies);
    };

    filterSource = () => {
        const { studies } = this.props;
        const source: any = this.props.map.getSource(INVASIVE_SOURCE_ID);
        if (source) {
            const filteredStudies = this.filterStudies(studies);
            this.props.setFilteredStudies(filteredStudies);
            const geoStudies = this.setupGeoJsonData(filteredStudies);
            source.setData(studiesToGeoJson(geoStudies));
        }
    };

    mountLayer(prevProps?: Props) {
        const { studies } = this.props;
        if (!prevProps || (prevProps.studies.length !== studies.length && studies.length)) {
            if (this.props.map.getSource(INVASIVE_SOURCE_ID)) {
                this.props.map.removeLayer(INVASIVE_LAYER_ID);
                this.props.map.removeSource(INVASIVE_SOURCE_ID);
            }
            const filteredStudies = this.filterStudies(studies);
            this.props.setFilteredStudies(filteredStudies);
            const geoStudies = this.setupGeoJsonData(filteredStudies);
            const source: any = {
                type: "geojson",
                data: studiesToGeoJson(geoStudies),
            };
            this.props.map.addSource(INVASIVE_SOURCE_ID, source);
            this.props.map.addLayer(layer(resolveMapTypeSymbols()));

            setupEffects(this.props.map, INVASIVE_SOURCE_ID, INVASIVE_LAYER_ID);

            this.renderLayer();
        }
    }

    onClickListener = (e: any) => {
        const selection = getSiteSelectionOnClick(e, this.props.map, INVASIVE_LAYER_ID);

        setTimeout(() => {
            this.props.setSelection(selection);

            const selectionStudies = selection
                ? this.filterStudies(this.props.studies).filter(study => study.SITE_ID === selection.SITE_ID)
                : [];

            this.props.setInvasiveSelectionStudies(selectionStudies);
        }, 100);
    };

    onMouseMoveListener = (e: any) => {
        this.props.map.getCanvas().style.cursor = "pointer";

        const selection = getSiteSelectionOnMove(e, this.props.map, INVASIVE_LAYER_ID);

        setTimeout(() => {
            this.props.setHoverSelection(selection);
        }, 100);
    };

    renderLayer = () => {
        if (this.props.map.getLayer(INVASIVE_LAYER_ID)) {
            if (this.props.theme === INVASIVE) {
                this.props.map.setLayoutProperty(INVASIVE_LAYER_ID, "visibility", "visible");
                this.props.map.on("mousemove", this.onMouseMoveListener);
                this.props.map.on("click", this.onClickListener);
            } else {
                this.props.map.setLayoutProperty(INVASIVE_LAYER_ID, "visibility", "none");
                this.props.map.off("mousemove", this.onMouseMoveListener);
                this.props.map.off("click", this.onClickListener);
            }
        }
    };

    applyMapTypeSymbols = () => {
        const layer = this.props.map.getLayer(INVASIVE_LAYER_ID);
        const mapTypeSymbols = resolveMapTypeSymbols();
        if (layer && mapTypeSymbols) {
            this.props.map.setPaintProperty(INVASIVE_LAYER_ID, "circle-radius", mapTypeSymbols["circle-radius"]);
            this.props.map.setPaintProperty(INVASIVE_LAYER_ID, "circle-color", mapTypeSymbols["circle-color"]);
            this.props.map.setPaintProperty(
                INVASIVE_LAYER_ID,
                "circle-stroke-color",
                mapTypeSymbols["circle-stroke-color"]
            );
        }
    };

    render() {
        const { studies, hoverSelection } = this.props;
        if (hoverSelection === null) {
            return <div />;
        }
        const filteredStudies = this.filterStudies(studies).filter(study => study.SITE_ID === hoverSelection.SITE_ID);
        if (filteredStudies.length === 0) {
            return <div />;
        }
        return (
            this.props.theme === "invasive" && (
                <>
                    <Hidden smDown>
                        <SitePopover map={this.props.map}>
                            <SiteTitle study={filteredStudies[0]} />
                        </SitePopover>
                    </Hidden>
                </>
            )
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(InvasiveLayer);
