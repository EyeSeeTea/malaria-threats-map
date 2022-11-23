import React from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import { logEventAction } from "../../store/actions/base-actions";
import { useTranslation } from "react-i18next";
import { selectTreatmentFilters } from "../../store/reducers/treatment-reducer";
import SwitchFilter from "./common/SwitchFilter";
import { setExcludeLowerSamples } from "../../store/actions/treatment-actions";

const mapStateToProps = (state: State) => ({
    treatmentFilters: selectTreatmentFilters(state),
});

const mapDispatchToProps = {
    setExcludeLowerSamples: setExcludeLowerSamples,
    logEventAction: logEventAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const ExcludeLowerPatientsFilter: React.FC<Props> = ({ setExcludeLowerSamples, treatmentFilters }) => {
    const { t } = useTranslation();

    return (
        <SwitchFilter
            label={t("common.filters.exclude_lower_samples")}
            onChange={setExcludeLowerSamples}
            value={treatmentFilters.excludeLowerSamples}
            analyticsFilterAction={"exclude lower samples"}
        />
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(ExcludeLowerPatientsFilter);
