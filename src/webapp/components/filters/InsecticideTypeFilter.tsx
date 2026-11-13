import React from "react";
import { connect } from "react-redux";
import { Source } from "../../store/actions/base-actions";
import { State } from "../../store/types";
import { selectInsecticideTypes } from "../../store/reducers/translations-reducer";
import { setInsecticideTypes } from "../../store/actions/prevention-actions";
import {
    selectFilteredPreventionStudies,
    selectPreventionFilters,
    selectPreventionStudiesOfMapTypeFrom,
} from "../../store/reducers/prevention-reducer";
import MultiFilter from "./common/MultiFilter";
import { useTranslation } from "react-i18next";
import { filterByInsecticideClass } from "../layers/studies-filters";
import { extractInsecticideTypeOptions } from "../../../domain/entities/PreventionStudy";

const mapStateToProps = (state: State, { from }: OwnProps) => ({
    insecticideTypes: selectInsecticideTypes(state),
    preventionFilters: selectPreventionFilters(state),
    preventionStudiesOfMapType: selectPreventionStudiesOfMapTypeFrom(state, from),
    filteredStudies: selectFilteredPreventionStudies(state),
});

const mapDispatchToProps = {
    setInsecticideTypes: setInsecticideTypes,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type OwnProps = { from: Source };
type Props = DispatchProps & StateProps & OwnProps;

const InsecticideTypeFilter: React.FC<Props> = ({
    preventionFilters,
    preventionStudiesOfMapType,
    setInsecticideTypes,
}) => {
    const { t } = useTranslation();

    const filters = [filterByInsecticideClass(preventionFilters.insecticideClass)];

    const filteredStudies = filters.reduce((studies, filter) => studies.filter(filter), preventionStudiesOfMapType);

    const suggestions = extractInsecticideTypeOptions(filteredStudies);

    return (
        <MultiFilter
            label={t("common.filters.insecticide_type")}
            placeholder={t("common.filters.select_insecticide_placeholder")}
            options={suggestions}
            onChange={setInsecticideTypes}
            value={preventionFilters.insecticideTypes}
            analyticsMultiFilterAction={"insecticideType"}
            isClearable={true}
        />
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(InsecticideTypeFilter);
