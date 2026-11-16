import React from "react";
import { State } from "../../store/types";
import { connect } from "react-redux";
import { Source } from "../../store/actions/base-actions";
import { useTranslation } from "react-i18next";
import {
    selectFilteredPreventionStudies,
    selectPreventionFilters,
    selectPreventionStudiesOfMapTypeFrom,
} from "../../store/reducers/prevention-reducer";
import { setInsecticideClass } from "../../store/actions/prevention-actions";
import RadioGroupFilter from "./RadioGroupFilter";
import i18next from "i18next";
import {
    getAvailableInsecticideClasses,
    getInsecticideClasses,
    sortInsecticideClasses,
} from "../../../domain/entities/InsecticideClass";

const mapStateToProps = (state: State, { from }: OwnProps) => ({
    preventionStudiesOfMapType: selectPreventionStudiesOfMapTypeFrom(state, from),
    preventionFilters: selectPreventionFilters(state),
    filteredStudies: selectFilteredPreventionStudies(state),
});

const mapDispatchToProps = {
    setInsecticideClass: setInsecticideClass,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type OwnProps = { from: Source };
type Props = DispatchProps & StateProps & OwnProps;

export { sortInsecticideClasses };

function toInsecticideClassOptions(insecticideClasses: ReadonlyArray<string>) {
    return insecticideClasses.map(insecticideClass => ({
        value: insecticideClass,
        label: i18next.t(insecticideClass),
    }));
}

export function getInsecticideClassOptions(insecticideClasses: string[]) {
    return toInsecticideClassOptions(getAvailableInsecticideClasses(insecticideClasses));
}

function InsecticideClassFilter({ preventionStudiesOfMapType = [], preventionFilters, setInsecticideClass }: Props) {
    const { t } = useTranslation();
    const handleChange = (event: React.ChangeEvent<unknown>) => {
        setInsecticideClass((event.target as HTMLInputElement).value);
    };

    const options = toInsecticideClassOptions(getInsecticideClasses(preventionStudiesOfMapType));

    return (
        <RadioGroupFilter
            label={t("common.filters.insecticide_class")}
            options={options}
            handleChange={handleChange}
            value={preventionFilters.insecticideClass}
        />
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(InsecticideClassFilter);
