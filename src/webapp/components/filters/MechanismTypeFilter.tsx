import React from "react";
import { State } from "../../store/types";
import { connect } from "react-redux";
import { Translation } from "../../types/Translation";
import { useTranslation } from "react-i18next";
import { selectTypes } from "../../store/reducers/translations-reducer";
import { selectPreventionFilters, selectPreventionStudies } from "../../store/reducers/prevention-reducer";
import { setType } from "../../store/actions/prevention-actions";
import { filterByLevelOfInvolvement, filterByRegion, filterByYearRange } from "../layers/studies-filters";
import * as R from "ramda";
import { selectFilters, selectRegion } from "../../store/reducers/base-reducer";
import { logEventAction } from "../../store/actions/base-actions";
import { PreventionStudy } from "../../../domain/entities/PreventionStudy";
import RadioGroupFilter from "./RadioGroupFilter";

export const WHITELISTED_TYPES = [
    "MONO_OXYGENASES",
    "ESTERASES",
    "GSTS",
    "KDR_L1014S",
    "KDR_L1014F",
    "KDR_(MUTATION_UNSPECIFIED)",
    "ACE1R",
];

const mapStateToProps = (state: State) => ({
    studies: selectPreventionStudies(state),
    types: selectTypes(state),
    preventionFilters: selectPreventionFilters(state),
    yearFilter: selectFilters(state),
    region: selectRegion(state),
});

const mapDispatchToProps = {
    setType: setType,
    logEventAction: logEventAction,
};

type OwnProps = {
    fromDb?: boolean;
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps & OwnProps;

function MechanismTypeFilter({
    studies,
    types = [],
    preventionFilters,
    setType,
    fromDb,
    yearFilter,
    region,
    logEventAction,
}: Props) {
    const { t } = useTranslation();
    const handleChange = (event: React.ChangeEvent<unknown>) => {
        const newValue = (event.target as HTMLInputElement).value;
        setType(newValue);
        logEventAction({ category: "filter", action: "mechanismType", label: newValue });
    };

    const filters = [filterByLevelOfInvolvement, filterByYearRange(yearFilter), filterByRegion(region)];

    const filteredStudies: PreventionStudy[] = filters.reduce((studies, filter) => studies.filter(filter), studies);

    const uniques = R.map(unique => ({ VALUE_: unique }), R.uniq(R.map(R.prop("TYPE"), filteredStudies)));

    const suggestions: Translation[] = (fromDb ? uniques : types) as Translation[];

    const filteredTypes = fromDb
        ? suggestions
        : WHITELISTED_TYPES.map(value => suggestions.find((type: any) => type.VALUE_ === value)).filter(Boolean);

    return (
        <RadioGroupFilter
            label={t("common.filters.mechanism_type")}
            options={filteredTypes.filter(translation => translation.VALUE_ !== "NA")}
            handleChange={handleChange}
            value={preventionFilters.type}
        />
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(MechanismTypeFilter);
