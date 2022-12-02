import React, { Component } from "react";
import { connect } from "react-redux";
import { State } from "../../../store/types";
import { studiesToGeoJson } from "../layer-utils";
import setupEffects from "../effects";
import * as R from "ramda";
import resistanceStatusSymbols from "./ResistanceStatus/symbols";
import { resolveResistanceStatus } from "./ResistanceStatus/utils";
import { buildPreventionFilters } from "../studies-filters";
import { resolveMapTypeSymbols, studySelector } from "./utils";
import { selectPreventionFilters, selectPreventionStudies } from "../../../store/reducers/prevention-reducer";
import {
    selectFilters,
    selectHoverSelection,
    selectRegion,
    selectSelection,
    selectTheme,
} from "../../../store/reducers/base-reducer";
import mapboxgl from "mapbox-gl";
import {
    fetchPreventionStudiesRequest,
    setPreventionFilteredStudies,
    setPreventionSelectionStudies,
} from "../../../store/actions/prevention-actions";
import { setHoverSelection, setSelection } from "../../../store/actions/base-actions";
import { PreventionStudy } from "../../../../domain/entities/PreventionStudy";
import SitePopover from "../common/SitePopover";
import Hidden from "../../../components/hidden/Hidden";
import SiteTitle from "../../site-title/SiteTitle";
import { getSiteSelectionOnClick, getSiteSelectionOnMove } from "../common/utils";

export const PREVENTION = "prevention";
const PREVENTION_LAYER_ID = "prevention-layer";
const PREVENTION_SOURCE_ID = "prevention-source";

const circleLayout = {
    visibility: "visible",
};

const layer: any = (symbols: any) => ({
    id: PREVENTION_LAYER_ID,
    type: "circle",
    layout: circleLayout,
    paint: symbols || resistanceStatusSymbols,
    source: PREVENTION_SOURCE_ID,
});

const mapStateToProps = (state: State) => ({
    studies: selectPreventionStudies(state),
    theme: selectTheme(state),
    filters: selectFilters(state),
    preventionFilters: selectPreventionFilters(state),
    region: selectRegion(state),
    selection: selectSelection(state),
    hoverSelection: selectHoverSelection(state),
});

const mapDispatchToProps = {
    fetchPreventionStudies: fetchPreventionStudiesRequest,
    setFilteredStudies: setPreventionFilteredStudies,
    setSelection: setSelection,
    setHoverSelection: setHoverSelection,
    setPreventionSelectionStudies: setPreventionSelectionStudies,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

type OwnProps = {
    map: mapboxgl.Map;
};
type Props = StateProps & DispatchProps & OwnProps;

class PreventionLayer extends Component<Props> {
    popup: mapboxgl.Popup;
    componentDidMount() {
        this.loadStudiesIfRequired();
        this.mountLayer();
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.theme !== "prevention") return;

        this.loadStudiesIfRequired();

        const {
            preventionFilters: {
                mapType,
                insecticideClass,
                insecticideTypes,
                type,
                species,
                assayTypes,
                synergistTypes,
                onlyByHealthMinistries,
            },
            filters,
            region,
        } = this.props;
        this.mountLayer(prevProps);
        this.renderLayer();
        const mapTypeChange = prevProps.preventionFilters.mapType !== mapType;
        const yearChange = prevProps.filters[0] !== filters[0] || prevProps.filters[1] !== filters[1];
        const countryChange = prevProps.region !== region;
        const insecticideChange = prevProps.preventionFilters.insecticideClass !== insecticideClass;
        const insecticideTypesChange = prevProps.preventionFilters.insecticideTypes.length !== insecticideTypes.length;
        const typeChange = prevProps.preventionFilters.type !== type;
        const speciesChange = prevProps.preventionFilters.species.length !== species.length;
        const assayTypesChange = prevProps.preventionFilters.assayTypes.length !== assayTypes.length;
        const synergistTypesChange = prevProps.preventionFilters.synergistTypes.length !== synergistTypes.length;
        const onlyByHealthMinistriesChange =
            prevProps.preventionFilters.onlyByHealthMinistries !== onlyByHealthMinistries;

        if (
            mapTypeChange ||
            yearChange ||
            countryChange ||
            insecticideChange ||
            insecticideTypesChange ||
            typeChange ||
            speciesChange ||
            assayTypesChange ||
            synergistTypesChange ||
            onlyByHealthMinistriesChange
        ) {
            if (this.popup) {
                this.popup.remove();
            }
            this.filterSource();
            this.applyMapTypeSymbols();
        }
    }
    loadStudiesIfRequired() {
        const { theme } = this.props;

        if (theme === PREVENTION) {
            this.props.fetchPreventionStudies();
        }
    }

    componentWillUnmount() {
        if (this.props.map.getLayer(PREVENTION_LAYER_ID)) {
            this.props.map.setLayoutProperty(PREVENTION_LAYER_ID, "visibility", "none");
        }
    }

    setupGeoJsonData = (studies: any[]) => {
        const { mapType } = this.props.preventionFilters;
        const groupedStudies = R.groupBy(R.path<string>(["SITE_ID"]), studies);
        const filteredStudies = R.values(groupedStudies).map(group => studySelector(group, mapType));

        return filteredStudies.map(study => {
            const percentage = parseFloat(study["MORTALITY_ADJUSTED"]);
            return {
                ...study,
                CONFIRMATION_STATUS: resolveResistanceStatus(percentage),
            };
        });
    };

    buildFilters = () => {
        const { preventionFilters, filters, region } = this.props;
        return buildPreventionFilters(preventionFilters, filters, region);
    };

    filterStudies = (studies: PreventionStudy[]) => {
        const filters = this.buildFilters();
        const result = filters.reduce((studies, filter) => studies.filter(filter), studies);

        return result;
    };

    filterSource = () => {
        const { studies } = this.props;
        const source: any = this.props.map.getSource(PREVENTION_SOURCE_ID);
        if (source) {
            const filteredStudies = this.filterStudies(studies);
            this.props.setFilteredStudies(filteredStudies);
            const geoStudies = this.setupGeoJsonData(filteredStudies);
            source.setData(studiesToGeoJson(geoStudies));
        }
    };

    mountLayer(prevProps?: Props) {
        const { studies, preventionFilters } = this.props;
        if (!prevProps || (prevProps.studies.length !== studies.length && studies.length)) {
            if (this.props.map.getSource(PREVENTION_SOURCE_ID)) {
                this.props.map.removeLayer(PREVENTION_LAYER_ID);
                this.props.map.removeSource(PREVENTION_SOURCE_ID);
            }

            const filteredStudies = this.filterStudies(studies);
            this.props.setFilteredStudies(filteredStudies);
            const geoStudies = this.setupGeoJsonData(filteredStudies);

            const source: any = {
                type: "geojson",
                data: studiesToGeoJson(geoStudies),
            };
            this.props.map.addSource(PREVENTION_SOURCE_ID, source);
            this.props.map.addLayer(layer(resolveMapTypeSymbols(preventionFilters)));

            setupEffects(this.props.map, PREVENTION_SOURCE_ID, PREVENTION_LAYER_ID);

            this.renderLayer();
        }
    }

    onClickListener = (e: any) => {
        const selection = getSiteSelectionOnClick(e, this.props.map, PREVENTION_LAYER_ID);

        setTimeout(() => {
            this.props.setSelection(selection);
        }, 100);
    };

    onMouseMoveListener = (e: any) => {
        this.props.map.getCanvas().style.cursor = "pointer";

        const selection = getSiteSelectionOnMove(e, this.props.map, PREVENTION_LAYER_ID);

        this.props.setHoverSelection(selection);
    };

    renderLayer = () => {
        if (!this.props.map) {
            return;
        }
        if (this.props.map.getLayer(PREVENTION_LAYER_ID)) {
            if (this.props.theme === PREVENTION) {
                this.props.map.setLayoutProperty(PREVENTION_LAYER_ID, "visibility", "visible");
                this.props.map.on("mousemove", this.onMouseMoveListener);
                this.props.map.on("click", this.onClickListener);
            } else {
                this.props.map.setLayoutProperty(PREVENTION_LAYER_ID, "visibility", "none");
                this.props.map.off("mousemove", this.onMouseMoveListener);
                this.props.map.off("click", this.onClickListener);
            }
        }
    };

    applyMapTypeSymbols = () => {
        const { preventionFilters } = this.props;
        const layer = this.props.map.getLayer(PREVENTION_LAYER_ID);
        const mapTypeSymbols = resolveMapTypeSymbols(preventionFilters);
        if (layer && mapTypeSymbols) {
            this.props.map.setPaintProperty(PREVENTION_LAYER_ID, "circle-radius", mapTypeSymbols["circle-radius"]);
            this.props.map.setPaintProperty(PREVENTION_LAYER_ID, "circle-color", mapTypeSymbols["circle-color"]);
            this.props.map.setPaintProperty(
                PREVENTION_LAYER_ID,
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
            this.props.theme === "prevention" && (
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
export default connect(mapStateToProps, mapDispatchToProps)(PreventionLayer);
