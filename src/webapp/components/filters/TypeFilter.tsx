import React from "react";
import { connect } from "react-redux";
import { PreventionMapType, State } from "../../store/types";
import { selectTypes } from "../../store/reducers/translations-reducer";
import { selectPreventionFilters, selectPreventionStudies } from "../../store/reducers/prevention-reducer";
import { setType } from "../../store/actions/prevention-actions";
import * as R from "ramda";
import {
    filterByAssayTypes,
    filterByInsecticideClass,
    filterByInsecticideTypes,
    filterByIntensityStatus,
    filterByLevelOfInvolvement,
    filterByRegion,
    filterByResistanceMechanism,
    filterByResistanceStatus,
    filterByTypeSynergist,
    filterByYearRange,
} from "../layers/studies-filters";
import { selectFilters, selectRegion } from "../../store/reducers/base-reducer";
import { logEventAction } from "../../store/actions/base-actions";
import { PreventionStudy } from "../../../domain/entities/PreventionStudy";
import { useTranslation } from "react-i18next";
import MultiFilter from "./common/MultiFilter";

const mapStateToProps = (state: State) => ({
    types: selectTypes(state),
    studies: selectPreventionStudies(state),
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
type Props = DispatchProps & StateProps;

const TypeFilter: React.FC<Props> = ({ setType, preventionFilters, studies, yearFilter, region }) => {
    const { t } = useTranslation();
    const { mapType } = preventionFilters;

    const filtersMap: { [mapType: string]: any[] } = {
        [PreventionMapType.INTENSITY_STATUS]: [
            filterByIntensityStatus,
            filterByInsecticideClass(preventionFilters.insecticideClass),
            filterByInsecticideTypes(preventionFilters.insecticideTypes),
            filterByYearRange(yearFilter),
            filterByRegion(region),
        ],
        [PreventionMapType.RESISTANCE_STATUS]: [
            filterByResistanceStatus,
            filterByInsecticideClass(preventionFilters.insecticideClass),
            filterByInsecticideTypes(preventionFilters.insecticideTypes),
            filterByYearRange(yearFilter),
            filterByRegion(region),
        ],
        [PreventionMapType.RESISTANCE_MECHANISM]: [
            filterByResistanceMechanism,
            filterByAssayTypes(preventionFilters.assayTypes),
            filterByYearRange(yearFilter),
            filterByRegion(region),
        ],
        [PreventionMapType.LEVEL_OF_INVOLVEMENT]: [
            filterByLevelOfInvolvement,
            filterByTypeSynergist(preventionFilters.synergistTypes),
            filterByYearRange(yearFilter),
            filterByRegion(region),
        ],
    };

    const filteredStudies: PreventionStudy[] = filtersMap[mapType].reduce(
        (studies, filter) => studies.filter(filter),
        studies
    );

    const uniques = R.uniq(R.map(R.prop("TYPE"), filteredStudies));

    const suggestions: any[] = uniques.map((type: string) => ({
        label: type,
        value: type,
    }));

    return (
        <MultiFilter
            label={t("common.filters.test_type")}
            placeholder={t("common.filters.select_test_type")}
            options={suggestions}
            onChange={setType}
            value={preventionFilters.type}
            analyticsMultiFilterAction="testType"
        />
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(TypeFilter);
