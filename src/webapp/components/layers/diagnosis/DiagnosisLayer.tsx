import React, { Component } from "react";
import { connect } from "react-redux";
import { State } from "../../../store/types";
import { circleLayout, studiesToGeoJson } from "../layer-utils";
import diagnosisSymbol from "../symbols/diagnosis";
import setupEffects from "../effects";
import {
    selectDiagnosisFilters,
    selectDiagnosisStudies,
    selectDiagnosisStudiesLoading,
    selectDiagnosisStudiesError,
} from "../../../store/reducers/diagnosis-reducer";
import {
    selectCountryMode,
    selectFilters,
    selectRegion,
    selectSelection,
    selectTheme,
} from "../../../store/reducers/base-reducer";
import * as R from "ramda";
import { resolveResistanceStatus } from "../prevention/ResistanceStatus/utils";
import { buildDiagnosisFilters } from "../studies-filters";
import { resolveMapTypeSymbols, studySelector } from "./utils";
import { DIAGNOSIS_STATUS } from "./GeneDeletions/utils";
import { selectCountries } from "../../../store/reducers/country-layer-reducer";
import {
    fetchDiagnosisStudiesRequest,
    setDiagnosisFilteredStudiesAction,
} from "../../../store/actions/diagnosis-actions";
import { Hidden } from "@material-ui/core";
import ChartModal from "../../ChartModal";
import DiagnosisSitePopover from "./DiagnosisSitePopover";
import DiagnosisSelectionChart from "./DiagnosisSelectionChart";
import { setSelection } from "../../../store/actions/base-actions";
import { DiagnosisStudy } from "../../../../domain/entities/DiagnosisStudy";

const DIAGNOSIS = "diagnosis";
const DIAGNOSIS_LAYER_ID = "diagnosis-layer";
const DIAGNOSIS_SOURCE_ID = "diagnosis-source";

const layer: any = (symbols: any) => ({
    id: DIAGNOSIS_LAYER_ID,
    type: "circle",
    layout: circleLayout,
    paint: symbols || diagnosisSymbol,
    source: DIAGNOSIS_SOURCE_ID,
});

const mapStateToProps = (state: State) => ({
    studies: selectDiagnosisStudies(state),
    studiesLoading: selectDiagnosisStudiesLoading(state),
    studiesError: selectDiagnosisStudiesError(state),
    theme: selectTheme(state),
    filters: selectFilters(state),
    diagnosisFilters: selectDiagnosisFilters(state),
    region: selectRegion(state),
    countries: selectCountries(state),
    countryMode: selectCountryMode(state),
    selection: selectSelection(state),
});

const mapDispatchToProps = {
    fetchDiagnosisStudies: fetchDiagnosisStudiesRequest,
    setFilteredStudies: setDiagnosisFilteredStudiesAction,
    setSelection: setSelection,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

type OwnProps = {
    map: any;
};
type Props = StateProps & DispatchProps & OwnProps;

class DiagnosisLayer extends Component<Props> {
    componentDidMount() {
        this.loadStudiesIfRequired();
        this.mountLayer();
    }

    componentDidUpdate(prevProps: Props) {
        this.loadStudiesIfRequired();

        const {
            diagnosisFilters: { mapType, surveyTypes, patientType, deletionType },
            filters,
            region,
            countryMode,
            countries,
        } = this.props;

        this.mountLayer(prevProps);
        this.renderLayer();
        const mapTypeChange = prevProps.diagnosisFilters.mapType !== mapType;
        const yearChange = prevProps.filters[0] !== filters[0] || prevProps.filters[1] !== filters[1];
        const surveyTypesChange = prevProps.diagnosisFilters.surveyTypes.length !== surveyTypes.length;
        const patientTypeChange = prevProps.diagnosisFilters.patientType !== patientType;
        const deletionTypeChange = prevProps.diagnosisFilters.deletionType !== deletionType;
        const countryChange = prevProps.region !== region;
        const countryModeChange = prevProps.countryMode !== countryMode;
        const countriesChange = prevProps.countries.length !== countries.length;
        if (
            mapTypeChange ||
            yearChange ||
            countryChange ||
            surveyTypesChange ||
            patientTypeChange ||
            deletionTypeChange ||
            countryModeChange ||
            countriesChange
        ) {
            this.filterSource();
            this.applyMapTypeSymbols();
        }
    }

    loadStudiesIfRequired() {
        const { theme, studies, studiesLoading, studiesError } = this.props;

        const required = theme === DIAGNOSIS && studies.length === 0 && !studiesLoading && !studiesError;

        if (required) {
            this.props.fetchDiagnosisStudies();
        }
    }

    componentWillUnmount() {
        this.renderLayer();
    }

    setupGeoJsonData = (studies: any[]) => {
        const groupedStudies = R.groupBy(R.path(["SITE_ID"]), studies);
        const filteredStudies = R.values(groupedStudies).map(group =>
            studySelector(group, this.props.diagnosisFilters.mapType, this.props.diagnosisFilters.deletionType)
        );

        return filteredStudies.map(study => {
            const percentage = parseFloat(study["MORTALITY_ADJUSTED"]);
            return {
                ...study,
                CONFIRMATION_STATUS: resolveResistanceStatus(percentage),
                DIAGNOSIS_PFHRP2_STATUS:
                    study.HRP2_POSITIVE > 0 ? DIAGNOSIS_STATUS.CONFIRMED : DIAGNOSIS_STATUS.NOT_IDENTIFIED,
                DIAGNOSIS_PFHRP2_PFHRP3_STATUS:
                    study.HRP2_HRP3_PROPORTION_DELETION > 0
                        ? DIAGNOSIS_STATUS.CONFIRMED
                        : DIAGNOSIS_STATUS.NOT_IDENTIFIED,
            };
        });
    };

    buildFilters = () => {
        const { diagnosisFilters, filters, region } = this.props;
        return buildDiagnosisFilters(diagnosisFilters, filters, region);
    };

    filterStudies = (studies: DiagnosisStudy[]) => {
        const filters = this.buildFilters();
        return filters.reduce((studies, filter) => studies.filter(filter), studies);
    };

    filterSource = () => {
        const { studies, countryMode } = this.props;
        const source = this.props.map.getSource(DIAGNOSIS_SOURCE_ID);
        if (source) {
            const filteredStudies = this.filterStudies(studies);
            this.props.setFilteredStudies(filteredStudies);
            const geoStudies = this.setupGeoJsonData(filteredStudies);
            const countryStudies = this.getCountryStudies(filteredStudies);
            const data = countryMode ? countryStudies : geoStudies;
            source.setData(studiesToGeoJson(data));
        }
    };

    getCountryStudies = (studies: any[] = []) => {
        const countryStudies = R.groupBy(R.path(["ISO2"]), studies);
        const countries = this.props.countries
            .map((country, index) => ({
                ...country,
                OBJECTID: index,
                Latitude: country.CENTER_LAT,
                Longitude: country.CENTER_LON,
                STUDIES: (countryStudies[country.ISO_2_CODE] || []).length || 0,
            }))
            .filter(study => study.STUDIES !== 0);

        const sortedCountries = R.sortBy(country => country.STUDIES, countries);
        if (sortedCountries.length === 0) return [];
        // const maxSize = sortedCountries[sortedCountries.length - 1].STUDIES;
        // const minSize = sortedCountries[0].STUDIES;

        // const ratio = (20 - 5) / (maxSize - minSize);

        const getSize = (nStudies: number) => {
            if (nStudies > 15) {
                return 15;
            } else if (nStudies > 10) {
                return 12.5;
            } else if (nStudies > 7) {
                return 10;
            } else if (nStudies > 5) {
                return 7.5;
            } else if (nStudies >= 0) {
                return 5;
            }
        };

        return countries.map(country => ({
            ...country,
            // SIZE: 5 + ratio * (country.STUDIES - minSize),
            // SIZE_HOVER: 5 + ratio * (country.STUDIES - minSize)
            SIZE: getSize(country.STUDIES),
            SIZE_HOVER: getSize(country.STUDIES) - 1,
        }));
    };

    mountLayer(prevProps?: Props) {
        const { studies, diagnosisFilters, countryMode } = this.props;
        if (!prevProps || prevProps.studies.length !== studies.length) {
            if (this.props.map.getSource(DIAGNOSIS_SOURCE_ID)) {
                this.props.map.removeLayer(DIAGNOSIS_LAYER_ID);
                this.props.map.removeSource(DIAGNOSIS_SOURCE_ID);
            }
            const filteredStudies = this.filterStudies(studies);
            this.props.setFilteredStudies(filteredStudies);
            const geoStudies = this.setupGeoJsonData(filteredStudies);
            const countryStudies = this.getCountryStudies(filteredStudies);

            const data = countryMode ? countryStudies : geoStudies;

            const source: any = {
                type: "geojson",
                data: studiesToGeoJson(data),
            };
            this.props.map.addSource(DIAGNOSIS_SOURCE_ID, source);
            this.props.map.addLayer(layer(resolveMapTypeSymbols(diagnosisFilters, countryMode)));

            setupEffects(this.props.map, DIAGNOSIS_SOURCE_ID, DIAGNOSIS_LAYER_ID);
            this.setupPopover();
            this.renderLayer();
        }
    }

    onClickListener = (e: any, _a: any) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        const selection = {
            ISO_2_CODE: e.features[0].properties.ISO_2_CODE,
            SITE_ID: e.features[0].properties.SITE_ID,
            coordinates: coordinates,
        };
        setTimeout(() => {
            this.props.setSelection(selection);
        }, 100);
    };

    setupPopover = () => {
        this.props.map.off("click", DIAGNOSIS_LAYER_ID, this.onClickListener);
        this.props.map.on("click", DIAGNOSIS_LAYER_ID, this.onClickListener);
    };

    renderLayer = () => {
        if (this.props.map.getLayer(DIAGNOSIS_LAYER_ID)) {
            if (this.props.theme === DIAGNOSIS) {
                this.props.map.setLayoutProperty(DIAGNOSIS_LAYER_ID, "visibility", "visible");
            } else {
                this.props.map.setLayoutProperty(DIAGNOSIS_LAYER_ID, "visibility", "none");
            }
        }
    };

    applyMapTypeSymbols = () => {
        const { diagnosisFilters, countryMode } = this.props;
        const layer = this.props.map.getLayer(DIAGNOSIS_LAYER_ID);
        const mapTypeSymbols = resolveMapTypeSymbols(diagnosisFilters, countryMode);
        if (layer && mapTypeSymbols) {
            this.props.map.setPaintProperty(DIAGNOSIS_LAYER_ID, "circle-radius", mapTypeSymbols["circle-radius"]);
            this.props.map.setPaintProperty(DIAGNOSIS_LAYER_ID, "circle-color", mapTypeSymbols["circle-color"]);
            this.props.map.setPaintProperty(
                DIAGNOSIS_LAYER_ID,
                "circle-stroke-color",
                mapTypeSymbols["circle-stroke-color"]
            );
        }
    };

    render() {
        const { studies, countryMode, selection } = this.props;
        if (selection === null) {
            return <div />;
        }
        const filteredStudies = this.filterStudies(studies).filter(study =>
            countryMode ? study.ISO2 === selection.ISO_2_CODE : study.SITE_ID === selection.SITE_ID
        );
        if (filteredStudies.length === 0) {
            return <div />;
        }
        return (
            this.props.theme === "diagnosis" && (
                <>
                    <Hidden xsDown>
                        <DiagnosisSitePopover map={this.props.map} studies={filteredStudies} />
                    </Hidden>
                    <Hidden smUp>
                        <ChartModal selection={selection}>
                            <DiagnosisSelectionChart studies={filteredStudies} />
                        </ChartModal>
                    </Hidden>
                </>
            )
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DiagnosisLayer);
