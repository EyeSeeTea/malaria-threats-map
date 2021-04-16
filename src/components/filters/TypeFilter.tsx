import React, { Component } from "react";
import { connect } from "react-redux";
import { PreventionMapType, State } from "../../store/types";
import IntegrationReactSelect from "../BasicSelect";
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
import { PreventionStudy } from "../../types/Prevention";
import { selectFilters, selectRegion } from "../../store/reducers/base-reducer";
import FormLabel from "@material-ui/core/FormLabel";
import { Divider, FilterWrapper } from "./Filters";
import T from "../../translations/T";
import { logEventAction } from "../../store/actions/base-actions";

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

class TypeFilter extends Component<Props, any> {
    onChange = (selection: any) => {
        this.props.setType(selection ? selection.value : undefined);
        if (selection) {
            this.props.logEventAction({ category: "filter", action: "testType", label: selection.value });
        }
    };

    render() {
        const { preventionFilters, studies, yearFilter, region } = this.props;
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

        const uniques = R.uniq(R.map(R.prop("TYPE"), filteredStudies));

        const suggestions: any[] = uniques.map((type: string) => ({
            label: type,
            value: type,
        }));

        const selection = suggestions.find(suggestion => this.props.preventionFilters.type === suggestion.value);

        return (
            <FilterWrapper>
                <FormLabel component="legend">
                    <T i18nKey={"filters.test_type"} />
                </FormLabel>
                <Divider />
                <IntegrationReactSelect
                    isClearable
                    suggestions={suggestions}
                    onChange={this.onChange}
                    value={selection || null}
                />
            </FilterWrapper>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TypeFilter);
