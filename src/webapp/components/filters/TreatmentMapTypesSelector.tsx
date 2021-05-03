import React from "react";
import { connect } from "react-redux";
import { State, TreatmentMapType } from "../../store/types";
import IntegrationReactSelect, { OptionType } from "../BasicSelect";
import { ValueType } from "react-select/src/types";
import { selectTreatmentFilters } from "../../store/reducers/treatment-reducer";
import { setTreatmentMapType } from "../../store/actions/treatment-actions";
import { useTranslation } from "react-i18next";
import { setMapTitleAction } from "../../store/actions/base-actions";
import { sendAnalyticsMapMenuChange } from "../../store/analytics";

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

const treatmentSuggestions: OptionType[] = [
    {
        label: "treatment.treatment_failure",
        value: TreatmentMapType.TREATMENT_FAILURE,
    },
    {
        label: "treatment.delayed_parasite_clearance",
        value: TreatmentMapType.DELAYED_PARASITE_CLEARANCE,
    },
    {
        label: "treatment.molecular_markers",
        value: TreatmentMapType.MOLECULAR_MARKERS,
    },
];

function TreatmentMapTypesSelector({ setTreatmentMapType, setMapTitle, treatmentFilters }: Props) {
    const { t } = useTranslation("common");

    const onChange = (value: ValueType<OptionType>) => {
        const selection = value as OptionType;
        setTreatmentMapType(selection.value);
        setMapTitle(t(selection.label));
        sendAnalyticsMapMenuChange("treatment", selection.value);
    };

    React.useEffect(() => {
        const selection = treatmentSuggestions.find(s => s.value === treatmentFilters.mapType);
        setMapTitle(t(selection.label));
    });

    return (
        <IntegrationReactSelect
            suggestions={treatmentSuggestions}
            onChange={onChange}
            value={treatmentSuggestions.find(s => s.value === treatmentFilters.mapType)}
        />
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(TreatmentMapTypesSelector);
