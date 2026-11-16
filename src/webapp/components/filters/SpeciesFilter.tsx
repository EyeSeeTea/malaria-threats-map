import React from "react";
import { connect } from "react-redux";
import { Source } from "../../store/actions/base-actions";
import { PreventionFilters, PreventionMapType, RegionState, State } from "../../store/types";
import { selectSpecies } from "../../store/reducers/translations-reducer";
import { selectPreventionFilters, selectPreventionStudiesOfMapTypeFrom } from "../../store/reducers/prevention-reducer";
import { setSpecies } from "../../store/actions/prevention-actions";
import {
    filterByAssayTypes,
    filterByInsecticideClass,
    filterByInsecticideTypes,
    filterByProxyType,
    filterByRegion,
    filterByTypes,
    filterByTypeSynergist,
    filterByYearRange,
    PreventionStudyFilter,
} from "../layers/studies-filters";
import { Option } from "../BasicSelect";
import { selectFilters, selectRegion } from "../../store/reducers/base-reducer";
import { PreventionStudy } from "../../../domain/entities/PreventionStudy";
import { useTranslation } from "react-i18next";
import MultiFilter from "./common/MultiFilter";

const mapStateToProps = (state: State, { from }: OwnProps) => ({
    species: selectSpecies(state),
    preventionStudiesOfMapType: selectPreventionStudiesOfMapTypeFrom(state, from),
    yearFilter: selectFilters(state),
    region: selectRegion(state),
    preventionFilters: selectPreventionFilters(state),
});

const mapDispatchToProps = {
    setSpecies: setSpecies,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type OwnProps = { from: Source };
type Props = DispatchProps & StateProps & OwnProps;

export function getSpeciesFilterOptions(
    preventionFilters: PreventionFilters,
    preventionStudiesOfMapType: PreventionStudy[],
    yearFilter: number[],
    region: RegionState
): Option[] {
    const { mapType } = preventionFilters;
    const filtersMap: Record<string, ReadonlyArray<PreventionStudyFilter>> = {
        [PreventionMapType.INTENSITY_STATUS]: [
            filterByInsecticideClass(preventionFilters.insecticideClass),
            filterByInsecticideTypes(preventionFilters.insecticideTypes),
            filterByTypes(preventionFilters.type),
            filterByYearRange(yearFilter),
            filterByRegion(region),
        ],
        [PreventionMapType.RESISTANCE_STATUS]: [
            filterByInsecticideClass(preventionFilters.insecticideClass),
            filterByInsecticideTypes(preventionFilters.insecticideTypes),
            filterByTypes(preventionFilters.type),
            filterByYearRange(yearFilter),
            filterByRegion(region),
        ],
        [PreventionMapType.RESISTANCE_MECHANISM]: [
            filterByTypes(preventionFilters.type),
            filterByAssayTypes(preventionFilters.assayTypes),
            filterByYearRange(yearFilter),
            filterByRegion(region),
        ],
        [PreventionMapType.LEVEL_OF_INVOLVEMENT]: [
            filterByProxyType(preventionFilters.proxyType),
            filterByTypeSynergist(preventionFilters.synergistTypes),
            filterByYearRange(yearFilter),
            filterByRegion(region),
        ],
    };

    const filteredStudies = filtersMap[mapType].reduce(
        (studies, filter) => studies.filter(filter),
        preventionStudiesOfMapType
    );

    const uniqueSpecies = Array.from(new Set(filteredStudies.map(study => study.SPECIES))).sort();

    return uniqueSpecies.map(species => ({ label: species, value: species }));
}

const SpeciesFilter: React.FC<Props> = ({
    preventionFilters,
    preventionStudiesOfMapType,
    yearFilter,
    region,
    setSpecies,
}) => {
    const { t } = useTranslation();
    const suggestions = getSpeciesFilterOptions(preventionFilters, preventionStudiesOfMapType, yearFilter, region);

    return (
        <MultiFilter
            label={t("common.filters.vector_species")}
            placeholder={t("common.filters.select_vector_species_placeholder")}
            options={suggestions}
            onChange={setSpecies}
            value={preventionFilters.species}
            analyticsMultiFilterAction={"vectorSpecies"}
            optionsStyle={{ fontStyle: "italic" }}
        />
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(SpeciesFilter);
