import React from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import { selectInsecticideTypes } from "../../store/reducers/translations-reducer";
import { setInsecticideTypes } from "../../store/actions/prevention-actions";
import {
    selectFilteredPreventionStudies,
    selectPreventionFilters,
    selectPreventionStudies,
} from "../../store/reducers/prevention-reducer";
import * as R from "ramda";
import MultiFilter from "./common/MultiFilter";
import { useTranslation } from "react-i18next";
import { filterByInsecticideClass } from "../layers/studies-filters";

const mapStateToProps = (state: State) => ({
    insecticideTypes: selectInsecticideTypes(state),
    preventionFilters: selectPreventionFilters(state),
    studies: selectPreventionStudies(state),
    filteredStudies: selectFilteredPreventionStudies(state),
});

const mapDispatchToProps = {
    setInsecticideTypes: setInsecticideTypes,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const InsecticideTypeFilter: React.FC<Props> = ({ preventionFilters, studies, setInsecticideTypes }) => {
    const { t } = useTranslation();

    const filters = [filterByInsecticideClass(preventionFilters.insecticideClass)];

    const filteredStudies = filters.reduce((studies, filter) => studies.filter(filter), studies);

    const uniques = R.uniq(R.map(R.prop("INSECTICIDE_TYPE"), filteredStudies));

    const suggestions: any[] = uniques.map((type: string) => ({
        label: type,
        value: type,
    }));

    return (
        <MultiFilter
            label={t("common.filters.insecticide_type")}
            placeholder={t("common.filters.select_insecticide_type")}
            options={suggestions}
            onChange={setInsecticideTypes}
            value={preventionFilters.insecticideTypes}
            analyticsMultiFilterAction={"insecticideType"}
        />
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(InsecticideTypeFilter);
