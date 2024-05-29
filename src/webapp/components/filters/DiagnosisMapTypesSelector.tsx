import React from "react";
import { connect } from "react-redux";
import { DiagnosisMapType, State } from "../../store/types";
import { setDiagnosisMapType } from "../../store/actions/diagnosis-actions";
import { selectDiagnosisFilters } from "../../store/reducers/diagnosis-reducer";
import { setActionGroupSelected, setMapTitleAction } from "../../store/actions/base-actions";
import { useTranslation } from "react-i18next";
import { sendAnalyticsMapMenuChange } from "../../store/analytics";
import { ListSelectorItem } from "../list-selector/ListSelector";
import MapTypeStudyGroups from "./common/MapTypeStudyGroups";

const mapStateToProps = (state: State) => ({
    diagnosisFilters: selectDiagnosisFilters(state),
});

const mapDispatchToProps = {
    setDiagnosisMapType: setDiagnosisMapType,
    setMapTitle: setMapTitleAction,
    setActionGroupSelected: setActionGroupSelected,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const diagnosisStudyResultsSuggestions: ListSelectorItem[] = [
    {
        title: "common.diagnosis.gene_deletions",
        subtitle: "common.diagnosis.gene_deletions_subtitle",
        value: DiagnosisMapType.GENE_DELETIONS,
    },
];

const diagnosisOngoingAndPlannedStudiesSuggestions: ListSelectorItem[] = [
    {
        title: "common.diagnosis.hrp23_studies",
        subtitle: "common.diagnosis.hrp23_studies_subtitle",
        value: DiagnosisMapType.HRP23_STUDIES,
    },
];

export const diagnosisSuggestions: ListSelectorItem[] = [
    ...diagnosisStudyResultsSuggestions,
    ...diagnosisOngoingAndPlannedStudiesSuggestions,
];

function DiagnosisMapTypesSelector({
    setDiagnosisMapType,
    setMapTitle,
    diagnosisFilters,
    setActionGroupSelected,
}: Props) {
    const { t } = useTranslation();

    const onChange = (selection: ListSelectorItem) => {
        setDiagnosisMapType(selection.value as DiagnosisMapType);
        setMapTitle(t(selection.title));
        sendAnalyticsMapMenuChange("diagnosis", selection.value as DiagnosisMapType);
        setActionGroupSelected("DATA");
    };

    const onMouseOver = (selection: ListSelectorItem) => {
        setDiagnosisMapType(selection.value as DiagnosisMapType);
    };

    React.useEffect(() => {
        const selection = diagnosisSuggestions.find(s => s.value === diagnosisFilters.mapType);
        setMapTitle(t(selection.title));
    });

    const studyResultsItems = React.useMemo(
        () =>
            diagnosisStudyResultsSuggestions.map(item => ({
                ...item,
                title: t(item.title),
                subtitle: t(item.subtitle),
            })),
        [t]
    );

    const ongoingAndPlannedStudiesItems = React.useMemo(
        () =>
            diagnosisOngoingAndPlannedStudiesSuggestions.map(item => ({
                ...item,
                title: t(item.title),
                subtitle: t(item.subtitle),
            })),
        [t]
    );

    const studyResultsValue = React.useMemo(
        () => studyResultsItems.find(s => s.value === diagnosisFilters.mapType),
        [diagnosisFilters.mapType, studyResultsItems]
    );

    const ongoingAndPlannedStudiesValue = React.useMemo(
        () => ongoingAndPlannedStudiesItems.find(s => s.value === diagnosisFilters.mapType),
        [diagnosisFilters.mapType, ongoingAndPlannedStudiesItems]
    );

    return (
        <MapTypeStudyGroups
            onChange={onChange}
            onMouseOver={onMouseOver}
            studyResults={studyResultsItems}
            ongoingAndPlannedStudies={ongoingAndPlannedStudiesItems}
            studyResultsValue={studyResultsValue}
            ongoingAndPlannedStudiesValue={ongoingAndPlannedStudiesValue}
        />
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(DiagnosisMapTypesSelector);
