import React from "react";
import { connect } from "react-redux";
import { PreventionMapType, State } from "../../store/types";
import { selectSpecies } from "../../store/reducers/translations-reducer";
import { selectPreventionFilters, selectPreventionStudies } from "../../store/reducers/prevention-reducer";
import { setSpecies } from "../../store/actions/prevention-actions";
import {
    filterByAssayTypes,
    filterByInsecticideClass,
    filterByInsecticideTypes,
    filterByIntensityStatus,
    filterByLevelOfInvolvement,
    filterByRegion,
    filterByResistanceMechanism,
    filterByResistanceStatus,
    filterByType,
    filterByTypeSynergist,
    filterByYearRange,
} from "../layers/studies-filters";
import * as R from "ramda";
import { selectFilters, selectRegion } from "../../store/reducers/base-reducer";
import { PreventionStudy } from "../../../domain/entities/PreventionStudy";
import { useTranslation } from "react-i18next";
import MultiFilter from "./common/MultiFilter";

const mapStateToProps = (state: State) => ({
    species: selectSpecies(state),
    studies: selectPreventionStudies(state),
    yearFilter: selectFilters(state),
    region: selectRegion(state),
    preventionFilters: selectPreventionFilters(state),
});

const mapDispatchToProps = {
    setSpecies: setSpecies,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const SpeciesFilter: React.FC<Props> = ({ preventionFilters, studies, yearFilter, region, setSpecies }) => {
    const { t } = useTranslation();
    const { mapType } = preventionFilters;
    const filtersMap: { [mapType: string]: any[] } = {
        [PreventionMapType.INTENSITY_STATUS]: [
            filterByIntensityStatus,
            filterByInsecticideClass(preventionFilters.insecticideClass),
            filterByInsecticideTypes(preventionFilters.insecticideTypes),
            filterByType(preventionFilters.type),
            filterByYearRange(yearFilter),
            filterByRegion(region),
        ],
        [PreventionMapType.RESISTANCE_STATUS]: [
            filterByResistanceStatus,
            filterByInsecticideClass(preventionFilters.insecticideClass),
            filterByInsecticideTypes(preventionFilters.insecticideTypes),
            filterByType(preventionFilters.type),
            filterByYearRange(yearFilter),
            filterByRegion(region),
        ],
        [PreventionMapType.RESISTANCE_MECHANISM]: [
            filterByResistanceMechanism,
            filterByType(preventionFilters.type),
            filterByAssayTypes(preventionFilters.assayTypes),
            filterByYearRange(yearFilter),
            filterByRegion(region),
        ],
        [PreventionMapType.LEVEL_OF_INVOLVEMENT]: [
            filterByLevelOfInvolvement,
            filterByType(preventionFilters.type),
            filterByTypeSynergist(preventionFilters.synergistTypes),
            filterByYearRange(yearFilter),
            filterByRegion(region),
        ],
        [PreventionMapType.PBO_DEPLOYMENT]: [
            filterByInsecticideClass(preventionFilters.insecticideClass),
            filterByInsecticideTypes(preventionFilters.insecticideTypes),
            filterByYearRange(yearFilter),
            filterByRegion(region),
        ],
    };

    const filteredStudies: PreventionStudy[] = filtersMap[mapType].reduce(
        (studies, filter) => studies.filter(filter),
        studies
    );

    const uniques = R.uniq(R.map(R.prop("SPECIES"), filteredStudies)).sort();

    const suggestions: any[] = uniques.map((specie: string) => ({
        label: specie,
        value: specie,
    }));

    return (
        <MultiFilter
            label={t("common.filters.vector_species")}
            options={suggestions}
            onChange={setSpecies}
            value={preventionFilters.species}
            analyticsMultiFilterAction={"vectorSpecies"}
        />
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(SpeciesFilter);
