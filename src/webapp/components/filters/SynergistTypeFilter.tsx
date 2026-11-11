import React from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import {
    selectPreventionFilters,
    selectPreventionStudiesByMapTypeSelected,
} from "../../store/reducers/prevention-reducer";
import { setSynergistTypes } from "../../store/actions/prevention-actions";
import MultiFilter from "./common/MultiFilter";
import { useTranslation } from "react-i18next";
import { Option } from "../BasicSelect";
import { PreventionStudy } from "../../../domain/entities/PreventionStudy";
import { getSynergistTypes } from "../../../domain/entities/ResistanceMechanism";

const mapStateToProps = (state: State) => ({
    preventionStudiesOfMapType: selectPreventionStudiesByMapTypeSelected(state),
    preventionFilters: selectPreventionFilters(state),
});

const mapDispatchToProps = {
    setSynergistTypes: setSynergistTypes,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

/** The test types of the synergist bioassays of the map, with the value as label, as before. */
export function getSynergistTypeOptions(preventionStudiesOfMapType: ReadonlyArray<PreventionStudy>): Option[] {
    return getSynergistTypes(preventionStudiesOfMapType).map(value => ({ label: value, value }));
}

const SynergistTypeFilter: React.FC<Props> = ({ preventionFilters, preventionStudiesOfMapType, setSynergistTypes }) => {
    const { t } = useTranslation();

    const suggestions = getSynergistTypeOptions(preventionStudiesOfMapType);

    return (
        <MultiFilter
            label={t("common.filters.synergist_type")}
            placeholder={t("common.filters.select_synergist_type_placeholder")}
            options={suggestions}
            onChange={setSynergistTypes}
            value={preventionFilters.synergistTypes}
            analyticsMultiFilterAction={"testType"}
        />
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(SynergistTypeFilter);
