import React from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import { selectDiagnosisFilters } from "../../store/reducers/diagnosis-reducer";
import { setDiagnosisDeletionType } from "../../store/actions/diagnosis-actions";
import SingleFilter from "./common/SingleFilter";
import { useTranslation } from "react-i18next";

const mapStateToProps = (state: State) => ({
    diagnosisFilters: selectDiagnosisFilters(state),
});

const mapDispatchToProps = {
    setDeletionType: setDiagnosisDeletionType,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

export const DELETION_TYPES = {
    HRP2_PROPORTION_DELETION: {
        label: "pfhrp2",
        value: "HRP2_PROPORTION_DELETION",
    },
    HRP2_HRP3_PROPORTION_DELETION: {
        label: "pfhrp2 + pfhrp3 (dual)",
        value: "HRP2_HRP3_PROPORTION_DELETION",
    },
};

const DeletionTypeFilter: React.FC<Props> = ({ setDeletionType, diagnosisFilters }) => {
    const { t } = useTranslation();
    const suggestions: any[] = Object.values(DELETION_TYPES);

    return (
        <SingleFilter
            label={t("common.filters.deletion_type")}
            placeholder={t("common.filters.select_deletion_type")}
            options={suggestions}
            onChange={setDeletionType}
            value={diagnosisFilters.deletionType}
        />
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(DeletionTypeFilter);
