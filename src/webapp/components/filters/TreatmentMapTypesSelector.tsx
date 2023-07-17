import React from "react";
import { connect } from "react-redux";
import { State, TreatmentMapType } from "../../store/types";
import { selectTreatmentFilters } from "../../store/reducers/treatment-reducer";
import { setTreatmentMapType } from "../../store/actions/treatment-actions";
import { useTranslation } from "react-i18next";
import { setActionGroupSelected, setMapTitleAction } from "../../store/actions/base-actions";
import { sendAnalyticsMapMenuChange } from "../../store/analytics";
import { ListSelectorItem } from "../list-selector/ListSelector";
import MapTypeStudyGroups from "./common/MapTypeStudyGroups";

const mapStateToProps = (state: State) => ({
    treatmentFilters: selectTreatmentFilters(state),
});

const mapDispatchToProps = {
    setTreatmentMapType: setTreatmentMapType,
    setMapTitle: setMapTitleAction,
    setActionGroupSelected: setActionGroupSelected,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const treatmentStudyResultsSuggestions: ListSelectorItem[] = [
    {
        title: "common.treatment.treatment_failure",
        subtitle: "common.treatment.treatment_failure_subtitle",
        value: TreatmentMapType.TREATMENT_FAILURE,
    },
    {
        title: "common.treatment.delayed_parasite_clearance",
        subtitle: "common.treatment.delayed_parasite_clearance_subtitle",
        value: TreatmentMapType.DELAYED_PARASITE_CLEARANCE,
    },
    {
        title: "common.treatment.molecular_markers",
        subtitle: "common.treatment.molecular_markers_subtitle",
        value: TreatmentMapType.MOLECULAR_MARKERS,
    },
];

const treatmentOngoingAndPlannedStudiesSuggestions: ListSelectorItem[] = [
    {
        title: "common.treatment.therapeutic_efficacy_studies",
        subtitle: "common.treatment.therapeutic_efficacy_studies_subtitle",
        value: TreatmentMapType.THERAPEUTIC_EFFICACY_STUDIES,
    },
    {
        title: "common.treatment.molecular_markers_ongoing_studies",
        subtitle: "common.treatment.molecular_markers_ongoing_studies_subtitle",
        value: TreatmentMapType.MOLECULAR_MARKERS_ONGOING_STUDIES,
    },
];

export const treatmentSuggestions: ListSelectorItem[] = [
    ...treatmentStudyResultsSuggestions,
    ...treatmentOngoingAndPlannedStudiesSuggestions,
];

function TreatmentMapTypesSelector({
    setTreatmentMapType,
    setMapTitle,
    treatmentFilters,
    setActionGroupSelected,
}: Props) {
    const { t } = useTranslation();

    const onChange = (selection: ListSelectorItem) => {
        setTreatmentMapType(selection.value as TreatmentMapType);
        setMapTitle(t(selection.title));
        sendAnalyticsMapMenuChange("treatment", selection.value as TreatmentMapType);
        setActionGroupSelected("DATA");
    };

    const onMouseOver = (selection: ListSelectorItem) => {
        setTreatmentMapType(selection.value as TreatmentMapType);
    };

    React.useEffect(() => {
        const selection = treatmentSuggestions.find(s => s.value === treatmentFilters.mapType);
        setMapTitle(t(selection.title));
    });

    const studyResultsItems = React.useMemo(
        () =>
            treatmentStudyResultsSuggestions.map(item => ({
                ...item,
                title: t(item.title),
                subtitle: t(item.subtitle),
            })),
        [t]
    );

    const ongoingAndPlannedStudiesItems = React.useMemo(
        () =>
            treatmentOngoingAndPlannedStudiesSuggestions.map(item => ({
                ...item,
                title: t(item.title),
                subtitle: t(item.subtitle),
            })),
        [t]
    );

    const studyResultsValue = React.useMemo(
        () => studyResultsItems.find(s => s.value === treatmentFilters.mapType),
        [studyResultsItems, treatmentFilters.mapType]
    );

    const ongoingAndPlannedStudiesValue = React.useMemo(
        () => ongoingAndPlannedStudiesItems.find(s => s.value === treatmentFilters.mapType),
        [ongoingAndPlannedStudiesItems, treatmentFilters.mapType]
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

export default connect(mapStateToProps, mapDispatchToProps)(TreatmentMapTypesSelector);
