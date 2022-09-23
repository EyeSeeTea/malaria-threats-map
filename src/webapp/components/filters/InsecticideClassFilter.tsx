import React from "react";
import { State } from "../../store/types";
import { connect } from "react-redux";
import { Translation } from "../../types/Translation";
import { useTranslation } from "react-i18next";
import { selectInsecticideClasses } from "../../store/reducers/translations-reducer";
import { selectFilteredPreventionStudies, selectPreventionFilters } from "../../store/reducers/prevention-reducer";
import { setInsecticideClass } from "../../store/actions/prevention-actions";
import RadioGroupFilter from "./RadioGroupFilter";
import i18next from "i18next";

const mapStateToProps = (state: State) => ({
    insecticideClasses: selectInsecticideClasses(state),
    preventionFilters: selectPreventionFilters(state),
    filteredStudies: selectFilteredPreventionStudies(state),
});

const mapDispatchToProps = {
    setInsecticideClass: setInsecticideClass,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

export const INSECTICIDE_CLASSES: string[] = [
    "PYRETHROIDS",
    "ORGANOCHLORINES",
    "CARBAMATES",
    "ORGANOPHOSPHATES",
    "PYRROLES",
];

export function getInsecticideClassOptions(insecticideClasses: Translation[]) {
    return (insecticideClasses as Translation[])
        .filter(translation => translation.VALUE_ !== "NA")
        .sort((a, b) => (INSECTICIDE_CLASSES.indexOf(a.VALUE_) - INSECTICIDE_CLASSES.indexOf(b.VALUE_) > 0 ? 1 : -1))
        .map(insecticide => ({
            value: insecticide.VALUE_,
            label: i18next.t(insecticide.VALUE_),
        }));
}

function InsecticideClassFilter({ insecticideClasses = [], preventionFilters, setInsecticideClass }: Props) {
    const { t } = useTranslation();
    const handleChange = (event: React.ChangeEvent<unknown>) => {
        setInsecticideClass((event.target as HTMLInputElement).value);
    };

    const options = getInsecticideClassOptions(insecticideClasses);

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
