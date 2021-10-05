import React from "react";
import { connect } from "react-redux";
import { InvasiveMapType, State } from "../../store/types";
import IntegrationReactSelect, { OptionType } from "../BasicSelect";
import { ValueType } from "react-select/src/types";
import { selectInvasiveFilters } from "../../store/reducers/invasive-reducer";
import { setInvasiveMapType } from "../../store/actions/invasive-actions";
import { useTranslation } from "react-i18next";
import { setMapTitleAction } from "../../store/actions/base-actions";
import { sendAnalyticsMapMenuChange } from "../../store/analytics";

const mapStateToProps = (state: State) => ({
    invasiveFilters: selectInvasiveFilters(state),
});

const mapDispatchToProps = {
    setInvasiveMapType: setInvasiveMapType,
    setMapTitle: setMapTitleAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const invasiveSuggestions: OptionType[] = [
    {
        label: "common.invasive.vector_occurrance",
        value: InvasiveMapType.VECTOR_OCCURANCE,
    },
];

function InvasiveMapTypesSelector({ setInvasiveMapType, setMapTitle, invasiveFilters }: Props) {
    const { t } = useTranslation();

    const onChange = (value: ValueType<OptionType, false>) => {
        const selection = value as OptionType;
        setInvasiveMapType(selection.value);
        setMapTitle(t(`common.${selection.label}`));
        sendAnalyticsMapMenuChange("invasive", selection.value);
    };

    React.useEffect(() => {
        const selection = invasiveSuggestions.find(s => s.value === invasiveFilters.mapType);
        setMapTitle(t(selection.label));
    });

    return (
        <IntegrationReactSelect
            suggestions={invasiveSuggestions}
            onChange={onChange}
            value={invasiveSuggestions.find(s => s.value === invasiveFilters.mapType)}
        />
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(InvasiveMapTypesSelector);
