import React from "react";
import { connect } from "react-redux";
import { DiagnosisMapType, State } from "../../store/types";
import { setDiagnosisMapType } from "../../store/actions/diagnosis-actions";
import { selectDiagnosisFilters } from "../../store/reducers/diagnosis-reducer";
import { setMapTitleAction } from "../../store/actions/base-actions";
import { useTranslation } from "react-i18next";
import { sendAnalyticsMapMenuChange } from "../../store/analytics";
import ListSelector, { ListSelectorItem } from "../list-selector/ListSelector";

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

export const diagnosisSuggestions: ListSelectorItem[] = [
    { title: "common.diagnosis.gene_deletions", value: DiagnosisMapType.GENE_DELETIONS },
    { title: "common.diagnosis.hrp23_studies", value: DiagnosisMapType.HRP23_STUDIES },
];

function DiagnosisMapTypesSelector({ setDiagnosisMapType, setMapTitle, diagnosisFilters }: Props) {
    const { t } = useTranslation();

    const onChange = (selection: ListSelectorItem) => {
        setDiagnosisMapType(selection.value as DiagnosisMapType);
        setMapTitle(t(selection.title));
        sendAnalyticsMapMenuChange("diagnosis", selection.value as DiagnosisMapType);
    };

    const onMouseOver = (selection: ListSelectorItem) => {
        setDiagnosisMapType(selection.value as DiagnosisMapType);
    };

    React.useEffect(() => {
        const selection = diagnosisSuggestions.find(s => s.value === diagnosisFilters.mapType);
        setMapTitle(t(selection.title));
    });

    const items = React.useMemo(
        () => diagnosisSuggestions.map(item => ({ ...item, title: t(item.title), subtitle: t(item.subtitle) })),
        [t]
    );

    const value = React.useMemo(() => items.find(s => s.value === diagnosisFilters.mapType), [diagnosisFilters, items]);

    return <ListSelector items={items} onChange={onChange} onMouseOver={onMouseOver} value={value} />;
}

export default connect(mapStateToProps, mapDispatchToProps)(DiagnosisMapTypesSelector);
