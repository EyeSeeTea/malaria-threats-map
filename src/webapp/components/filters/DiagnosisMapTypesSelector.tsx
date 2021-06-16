import React from "react";
import { connect } from "react-redux";
import { DiagnosisMapType, State } from "../../store/types";
import IntegrationReactSelect, { OptionType } from "../BasicSelect";
import { ValueType } from "react-select/src/types";
import { setDiagnosisMapType } from "../../store/actions/diagnosis-actions";
import { selectDiagnosisFilters } from "../../store/reducers/diagnosis-reducer";
import { setMapTitleAction } from "../../store/actions/base-actions";
import { useTranslation } from "react-i18next";
import { sendAnalyticsMapMenuChange } from "../../store/analytics";

const mapStateToProps = (state: State) => ({
    diagnosisFilters: selectDiagnosisFilters(state),
});

const mapDispatchToProps = {
    setDiagnosisMapType: setDiagnosisMapType,
    setMapTitle: setMapTitleAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const diagnosisSuggestions: OptionType[] = [
    { label: "common.diagnosis.gene_deletions", value: DiagnosisMapType.GENE_DELETIONS },
];

function DiagnosisMapTypesSelector({ setDiagnosisMapType, setMapTitle, diagnosisFilters }: Props) {
    const { t } = useTranslation();

    const onChange = (value: ValueType<OptionType, false>) => {
        const selection = value as OptionType;
        setDiagnosisMapType(selection.value);
        setMapTitle(t(selection.label));
        sendAnalyticsMapMenuChange("diagnosis", selection.value);
    };

    React.useEffect(() => {
        const selection = diagnosisSuggestions.find(s => s.value === diagnosisFilters.mapType);
        setMapTitle(t(selection.label));
    });

    return (
        <IntegrationReactSelect
            suggestions={diagnosisSuggestions}
            onChange={onChange}
            value={diagnosisSuggestions.find(s => s.value === diagnosisFilters.mapType)}
        />
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(DiagnosisMapTypesSelector);
