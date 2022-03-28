import React from "react";
import { connect } from "react-redux";
import { PreventionMapType, State } from "../../store/types";
import { setPreventionMapType } from "../../store/actions/prevention-actions";
import { selectPreventionFilters } from "../../store/reducers/prevention-reducer";
import { setMapTitleAction } from "../../store/actions/base-actions";
import { useTranslation } from "react-i18next";
import { sendAnalyticsMapMenuChange } from "../../store/analytics";
import ListSelector, { ListSelectorItem } from "../list-selector/ListSelector";

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

const preventionSuggestions: ListSelectorItem[] = [
    {
        title: "common.prevention.resistance_status",
        subtitle: "common.prevention.resistance_status_subtitle",
        value: PreventionMapType.RESISTANCE_STATUS,
    },
    {
        title: "common.prevention.resistance_intensity",
        subtitle: "common.prevention.resistance_intensity_subtitle",
        value: PreventionMapType.INTENSITY_STATUS,
    },
    {
        title: "common.prevention.resistance_mechanism",
        subtitle: "common.prevention.resistance_mechanism_subtitle",
        value: PreventionMapType.RESISTANCE_MECHANISM,
    },
    {
        title: "common.prevention.synergist_involvement",
        subtitle: "common.prevention.synergist_involvement_subtitle",
        value: PreventionMapType.LEVEL_OF_INVOLVEMENT,
    },
    {
        title: "common.prevention.pbo_deployment",
        subtitle: "common.prevention.pbo_deployment_subtitle",
        value: PreventionMapType.PBO_DEPLOYMENT,
    },
];
function PreventionMapTypesSelector({ preventionFilters, setPreventionMapType, setMapTitle }: Props) {
    const { t } = useTranslation();

    const onChange = (selection: ListSelectorItem) => {
        setPreventionMapType(selection.value as PreventionMapType);
        setMapTitle(t(selection.title));
        sendAnalyticsMapMenuChange("prevention", selection.value as PreventionMapType);
    };

    React.useEffect(() => {
        const selection = preventionSuggestions.find(s => s.value === preventionFilters.mapType);
        setMapTitle(t(selection.title));
    });

    const items = React.useMemo(
        () => preventionSuggestions.map(item => ({ ...item, title: t(item.title), subtitle: t(item.subtitle) })),
        [t]
    );

    const value = React.useMemo(
        () => items.find(s => s.value === preventionFilters.mapType),
        [preventionFilters, items]
    );

    return <ListSelector items={items} onChange={onChange} value={value} />;
}

export default connect(mapStateToProps, mapDispatchToProps)(PreventionMapTypesSelector);
