import React from "react";
import { connect } from "react-redux";
import { State, TreatmentMapType } from "../../store/types";
import { selectTreatmentFilters } from "../../store/reducers/treatment-reducer";
import { setTreatmentMapType } from "../../store/actions/treatment-actions";
import { useTranslation } from "react-i18next";
import { setMapTitleAction } from "../../store/actions/base-actions";
import { sendAnalyticsMapMenuChange } from "../../store/analytics";
import ListSelector, { ListSelectorItem } from "../list-selector/ListSelector";

const mapStateToProps = (state: State) => ({
    treatmentFilters: selectTreatmentFilters(state),
});

const mapDispatchToProps = {
    setTreatmentMapType: setTreatmentMapType,
    setMapTitle: setMapTitleAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

export const treatmentSuggestions: ListSelectorItem[] = [
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

function TreatmentMapTypesSelector({ setTreatmentMapType, setMapTitle, treatmentFilters }: Props) {
    const { t } = useTranslation();

    const onChange = (selection: ListSelectorItem) => {
        setTreatmentMapType(selection.value as TreatmentMapType);
        setMapTitle(t(selection.title));
        sendAnalyticsMapMenuChange("treatment", selection.value as TreatmentMapType);
    };

    React.useEffect(() => {
        const selection = treatmentSuggestions.find(s => s.value === treatmentFilters.mapType);
        setMapTitle(t(selection.title));
    });

    const items = React.useMemo(
        () => treatmentSuggestions.map(item => ({ ...item, title: t(item.title), subtitle: t(item.subtitle) })),
        [t]
    );

    const value = React.useMemo(() => items.find(s => s.value === treatmentFilters.mapType), [treatmentFilters, items]);

    return <ListSelector items={items} onChange={onChange} value={value} />;
}

export default connect(mapStateToProps, mapDispatchToProps)(TreatmentMapTypesSelector);
