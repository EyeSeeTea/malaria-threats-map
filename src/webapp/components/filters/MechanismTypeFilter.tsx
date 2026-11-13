import React from "react";
import { State } from "../../store/types";
import { connect } from "react-redux";
import { Translation } from "../../types/Translation";
import { useTranslation } from "react-i18next";
import { selectTypes } from "../../store/reducers/translations-reducer";
import {
    selectPreventionFilters,
    selectPreventionStudiesOfMapTypeAndDisease,
} from "../../store/reducers/prevention-reducer";
import { setType } from "../../store/actions/prevention-actions";
import { logEventAction, Source } from "../../store/actions/base-actions";
import RadioGroupFilter from "./RadioGroupFilter";
import i18next from "i18next";
import { PreventionStudy } from "../../../domain/entities/PreventionStudy";
import { getMechanismOptions } from "../../../domain/entities/ResistanceMechanism";

const mapStateToProps = (state: State) => ({
    types: selectTypes(state),
    preventionFilters: selectPreventionFilters(state),
    preventionStudiesOfMapType: selectPreventionStudiesOfMapTypeAndDisease(state),
});

const mapDispatchToProps = {
    setType: setType,
    logEventAction: logEventAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type OwnProps = { from: Source };
type Props = DispatchProps & StateProps & OwnProps;

/**
 * The map offers the mechanisms of its studies. Data Download, out of scope, keeps reading the TYPE
 * translations: there the selected map type is the last map visited, not the mechanisms one.
 */
export function getMechanismTypeOptions(
    from: Source,
    preventionStudiesOfMapType: ReadonlyArray<PreventionStudy>,
    types: ReadonlyArray<Translation>
) {
    const codes = from === "map" ? preventionStudiesOfMapType.map(study => study.TYPE) : types.map(type => type.VALUE_);

    return getMechanismOptions(codes).map(value => ({
        value: value,
        label: i18next.t(`TYPE.${value}`, { defaultValue: value }),
    }));
}

function MechanismTypeFilter({
    types = [],
    preventionFilters,
    preventionStudiesOfMapType,
    setType,
    logEventAction,
    from,
}: Props) {
    const { t } = useTranslation();
    const handleChange = (event: React.ChangeEvent<unknown>) => {
        const newValue = (event.target as HTMLInputElement).value;
        setType([newValue]);
        logEventAction({ category: "filter", action: "mechanismType", label: newValue });
    };
    const options = getMechanismTypeOptions(from, preventionStudiesOfMapType, types as Translation[]);

    const value = React.useMemo(
        () => (preventionFilters.type?.length === 1 ? preventionFilters.type[0] : undefined),
        [preventionFilters.type]
    );

    return (
        <RadioGroupFilter
            label={t("common.filters.mechanism_type")}
            options={options}
            handleChange={handleChange}
            value={value}
        />
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(MechanismTypeFilter);
