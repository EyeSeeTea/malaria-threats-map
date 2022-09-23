import React from "react";
import { State } from "../../store/types";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectInsecticideClasses } from "../../store/reducers/translations-reducer";
import MultiFilter from "../../components/filters/common/MultiFilter";
import { getInsecticideClassOptions } from "./InsecticideClassFilter";

const mapStateToProps = (state: State) => ({
    insecticideClasses: selectInsecticideClasses(state),
});

type StateProps = ReturnType<typeof mapStateToProps>;
interface OwnProps {
    onChange: (selection: string[]) => void;
    value: string[];
}

type Props = OwnProps & StateProps;

function InsecticideClassSelector({ insecticideClasses = [], onChange, value }: Props) {
    const { t } = useTranslation();

    const options = getInsecticideClassOptions(insecticideClasses);

    return (
        <MultiFilter
            labelPosition="top"
            label={t("common.filters.insecticide_class")}
            options={options}
            onChange={onChange}
            value={value}
            margin={"10px 0px"}
            isClearable={true}
        />
    );
}

export default connect(mapStateToProps)(InsecticideClassSelector);
