import React from "react";
import { connect } from "react-redux";
import { InvasiveMapType, State } from "../../store/types";
import { selectInvasiveFilters } from "../../store/reducers/invasive-reducer";
import { setInvasiveMapType } from "../../store/actions/invasive-actions";
import { useTranslation } from "react-i18next";
import { setMapTitleAction } from "../../store/actions/base-actions";
import { sendAnalyticsMapMenuChange } from "../../store/analytics";
import ListSelector, { ListSelectorItem } from "../list-selector/ListSelector";

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

export const invasiveSuggestions: ListSelectorItem[] = [
    {
        title: "common.invasive.vector_occurrance",
        value: InvasiveMapType.VECTOR_OCCURANCE,
    },
];

function InvasiveMapTypesSelector({ setInvasiveMapType, setMapTitle, invasiveFilters }: Props) {
    const { t } = useTranslation();

    const onChange = (selection: ListSelectorItem) => {
        setInvasiveMapType(selection.value as InvasiveMapType);
        setMapTitle(t(`common.${selection.title}`));
        sendAnalyticsMapMenuChange("invasive", selection.value as InvasiveMapType);
    };

    React.useEffect(() => {
        const selection = invasiveSuggestions.find(s => s.value === invasiveFilters.mapType);
        setMapTitle(t(selection.title));
    });

    const items = React.useMemo(
        () => invasiveSuggestions.map(item => ({ ...item, title: t(item.title), subtitle: t(item.subtitle) })),
        [t]
    );

    const value = React.useMemo(() => items.find(s => s.value === invasiveFilters.mapType), [invasiveFilters, items]);

    return <ListSelector items={items} onChange={onChange} value={value} />;
}

export default connect(mapStateToProps, mapDispatchToProps)(InvasiveMapTypesSelector);
