import React from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import { logEventAction } from "../../store/actions/base-actions";
import { useTranslation } from "react-i18next";
import { selectTreatmentFilters } from "../../store/reducers/treatment-reducer";
import { setExcludeLowerPatients } from "../../store/actions/treatment-actions";
import SwitchFilter from "./common/SwitchFilter";

const mapStateToProps = (state: State) => ({
    treatmentFilters: selectTreatmentFilters(state),
});

const mapDispatchToProps = {
    setExcludeLowerPatients: setExcludeLowerPatients,
    logEventAction: logEventAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const ExcludeLowerPatientsFilter: React.FC<Props> = ({ setExcludeLowerPatients, treatmentFilters }) => {
    const { t } = useTranslation();

    return (
        <SwitchFilter
            label={t("common.filters.exclude_lower_patients")}
            onChange={setExcludeLowerPatients}
            value={treatmentFilters.excludeLowerPatients}
            analyticsFilterAction={"exclude lower patients"}
        />
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(ExcludeLowerPatientsFilter);
