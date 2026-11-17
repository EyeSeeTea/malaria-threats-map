import React from "react";
import { connect } from "react-redux";
import { PreventionFilters, PreventionMapType, RegionState, State } from "../../store/types";
import { selectTypes } from "../../store/reducers/translations-reducer";
import { selectPreventionFilters, selectPreventionStudiesOfMapTypeFrom } from "../../store/reducers/prevention-reducer";
import { setType } from "../../store/actions/prevention-actions";
import {
    filterByAssayTypes,
    filterByInsecticideClass,
    filterByInsecticideTypes,
    filterByRegion,
    filterByTypeSynergist,
    filterByYearRange,
    PreventionStudyFilter,
} from "../layers/studies-filters";
import { Option } from "../BasicSelect";
import { selectFilters, selectRegion } from "../../store/reducers/base-reducer";
import { logEventAction, Source } from "../../store/actions/base-actions";
import { PreventionStudy } from "../../../domain/entities/PreventionStudy";
import { useTranslation } from "react-i18next";
import MultiFilter from "./common/MultiFilter";
import { replacesValuesNotOfferedOnMap } from "../../store/diseaseMapBehaviour";
import { useDropValuesNotOffered } from "./common/useReplaceValuesNotOffered";

const mapStateToProps = (state: State, { from }: OwnProps) => ({
    types: selectTypes(state),
    preventionStudiesOfMapType: selectPreventionStudiesOfMapTypeFrom(state, from),
    yearFilter: selectFilters(state),
    region: selectRegion(state),
    preventionFilters: selectPreventionFilters(state),
});

const mapDispatchToProps = {
    setType: setType,
    logEventAction: logEventAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type OwnProps = { from: Source };
type Props = DispatchProps & StateProps & OwnProps;

export function getTypeFilterOptions(
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
            filterByYearRange(yearFilter),
            filterByRegion(region),
        ],
        [PreventionMapType.RESISTANCE_STATUS]: [
            filterByInsecticideClass(preventionFilters.insecticideClass),
            filterByInsecticideTypes(preventionFilters.insecticideTypes),
            filterByYearRange(yearFilter),
            filterByRegion(region),
        ],
        [PreventionMapType.RESISTANCE_MECHANISM]: [
            filterByAssayTypes(preventionFilters.assayTypes),
            filterByYearRange(yearFilter),
            filterByRegion(region),
        ],
        [PreventionMapType.LEVEL_OF_INVOLVEMENT]: [
            filterByTypeSynergist(preventionFilters.synergistTypes),
            filterByYearRange(yearFilter),
            filterByRegion(region),
        ],
    };

    const filteredStudies = filtersMap[mapType].reduce(
        (studies, filter) => studies.filter(filter),
        preventionStudiesOfMapType
    );

    const uniqueTypes = Array.from(new Set(filteredStudies.map(study => study.TYPE)));

    return uniqueTypes.map(type => ({ label: type, value: type }));
}

const TypeFilter: React.FC<Props> = ({
    setType,
    preventionFilters,
    preventionStudiesOfMapType,
    yearFilter,
    region,
    from,
}) => {
    const { t } = useTranslation();
    const suggestions = getTypeFilterOptions(preventionFilters, preventionStudiesOfMapType, yearFilter, region);

    useDropValuesNotOffered(
        replacesValuesNotOfferedOnMap(from, preventionFilters.disease),
        preventionFilters.type ?? [],
        preventionStudiesOfMapType.map(study => study.TYPE),
        setType
    );

    return (
        <MultiFilter
            label={t("common.filters.test_type")}
            placeholder={t("common.filters.select_test_type_placeholder")}
            options={suggestions}
            onChange={setType}
            value={preventionFilters.type}
            analyticsMultiFilterAction="testType"
        />
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(TypeFilter);
