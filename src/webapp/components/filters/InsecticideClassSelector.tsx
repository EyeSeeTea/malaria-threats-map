import React from "react";
import { State } from "../../store/types";
import { connect } from "react-redux";
import { Translation } from "../../types/Translation";
import { useTranslation } from "react-i18next";
import { selectInsecticideClasses } from "../../store/reducers/translations-reducer";
import MultiFilter from "../../components/filters/common/MultiFilter";

const mapStateToProps = (state: State) => ({
    insecticideClasses: selectInsecticideClasses(state),
});

type StateProps = ReturnType<typeof mapStateToProps>;
interface OwnProps {
    onChange: (selection: string[]) => void;
    value: string[];
}

type Props = OwnProps & StateProps;

export const INSECTICIDE_CLASSES: string[] = [
    "PYRETHROIDS",
    "ORGANOCHLORINES",
    "CARBAMATES",
    "ORGANOPHOSPHATES",
    "PYRROLES",
];

function InsecticideClassSelector({ insecticideClasses = [], onChange, value }: Props) {
    const { t } = useTranslation();

    const options = (insecticideClasses as Translation[])
        .filter(translation => translation.VALUE_ !== "NA")
        .sort((a, b) => (INSECTICIDE_CLASSES.indexOf(a.VALUE_) - INSECTICIDE_CLASSES.indexOf(b.VALUE_) > 0 ? 1 : -1))
        .map(insecticide => ({
            value: insecticide.VALUE_,
            label: t(insecticide.VALUE_),
        }));

    return (
        <MultiFilter
            labelPosition="top"
            label={t("common.filters.insecticide_class")}
            options={options}
            onChange={onChange}
            value={value}
            margin={"10px 0px"}
        />
    );
}

export default connect(mapStateToProps)(InsecticideClassSelector);
