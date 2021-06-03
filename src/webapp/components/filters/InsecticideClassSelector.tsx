import React from "react";
import { useTranslation } from "react-i18next";
import { Option } from "../BasicSelect";
import { INSECTICIDE_CLASSES } from "./InsecticideClassFilter";
import MultiSelector from "./MultiSelector";

type OwnProps = {
    onChange: (selection: string[]) => void;
    value: string[];
};

type Props = OwnProps;

function InsecticideClassSelector({ value, onChange }: Props) {
    const { t } = useTranslation("common");

    const suggestions: Option[] = INSECTICIDE_CLASSES.map((specie: string) => ({
        label: t(specie),
        value: specie,
    }));

    return (
        <MultiSelector label={t("filters.insecticide_class")} options={suggestions} onChange={onChange} value={value} />
    );
}
export default InsecticideClassSelector;
