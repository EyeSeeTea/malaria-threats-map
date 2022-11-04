import React from "react";
import { State } from "../../store/types";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectInsecticideClasses } from "../../store/reducers/translations-reducer";
import MultiFilter from "../../components/filters/common/MultiFilter";
import { getInsecticideClassOptions } from "./InsecticideClassFilter";
import RadioGroupFilter from "./RadioGroupFilter";
import { Translation } from "../../types/Translation";

const mapStateToProps = (state: State) => ({
    insecticideClasses: selectInsecticideClasses(state),
});

type StateProps = ReturnType<typeof mapStateToProps>;
interface OwnProps {
    type: "radio" | "select";
    onChange: (selection: string[]) => void;
    value: string[];
}

type Props = OwnProps & StateProps;

function InsecticideClassSelector({ type, insecticideClasses = [], onChange, value }: Props) {
    const { t } = useTranslation();

    const options = getInsecticideClassOptions(
        insecticideClasses.map((insecticide: Translation) => insecticide.VALUE_)
    );

    const handleRadioChange = (event: React.ChangeEvent<unknown>) => {
        const value = (event.target as HTMLInputElement).value;
        onChange([value]);
    };

    return type === "select" ? (
        <MultiFilter
            labelPosition="top"
            label={t("common.filters.insecticide_class")}
            options={options}
            onChange={onChange}
            value={value}
            margin={"10px 0px"}
            isClearable={true}
        />
    ) : (
        <RadioGroupFilter
            label={t("common.filters.insecticide_class")}
            options={options}
            handleChange={handleRadioChange}
            margin={"10px 0px"}
            padding={"10px 0px"}
            value={value.length > 0 ? value[0] : options[0].value}
            background={"white"}
            labelFontSize="14px"
            labelFontWeight="bold"
        />
    );
}

export default connect(mapStateToProps)(InsecticideClassSelector);
