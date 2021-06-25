import React from "react";
import { connect } from "react-redux";
import { PreventionMapType, State } from "../../store/types";
import IntegrationReactSelect, { OptionType } from "../BasicSelect";
import { ValueType } from "react-select/src/types";
import { setPreventionMapType } from "../../store/actions/prevention-actions";
import { selectPreventionFilters } from "../../store/reducers/prevention-reducer";
import { setMapTitleAction } from "../../store/actions/base-actions";
import { useTranslation } from "react-i18next";
import { sendAnalyticsMapMenuChange } from "../../store/analytics";

const mapStateToProps = (state: State) => ({
    preventionFilters: selectPreventionFilters(state),
});

const mapDispatchToProps = {
    setPreventionMapType: setPreventionMapType,
    setMapTitle: setMapTitleAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const preventionSuggestions: OptionType[] = [
    {
        label: "common.prevention.resistance_status",
        value: PreventionMapType.RESISTANCE_STATUS,
    },
    {
        label: "common.prevention.resistance_intensity",
        value: PreventionMapType.INTENSITY_STATUS,
    },
    {
        label: "common.prevention.resistance_mechanism",
        value: PreventionMapType.RESISTANCE_MECHANISM,
    },
    {
        label: "common.prevention.synergist_involvement",
        value: PreventionMapType.LEVEL_OF_INVOLVEMENT,
    },
    {
        label: "common.prevention.pbo_deployment",
        value: PreventionMapType.PBO_DEPLOYMENT,
    },
];
function PreventionMapTypesSelector({ preventionFilters, setPreventionMapType, setMapTitle }: Props) {
    const { t } = useTranslation();

    const onChange = (value: ValueType<OptionType, false>) => {
        const selection = value as OptionType;
        setPreventionMapType(selection.value);
        setMapTitle(t(selection.label));
        sendAnalyticsMapMenuChange("prevention", selection.value);
    };

    React.useEffect(() => {
        const selection = preventionSuggestions.find(s => s.value === preventionFilters.mapType);
        setMapTitle(t(selection.label));
    });

    return (
        <IntegrationReactSelect
            suggestions={preventionSuggestions}
            onChange={onChange}
            value={preventionSuggestions.find(s => s.value === preventionFilters.mapType)}
        />
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(PreventionMapTypesSelector);
