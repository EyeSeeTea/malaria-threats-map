import React from "react";
import MultiFilter from "./common/MultiFilter";
import { useTranslation } from "react-i18next";
import { PreventionStudy } from "../../../domain/entities/PreventionStudy";
import { getInsecticideTypes } from "./InsecticideTypeFilter";

interface Props {
    insecticideClassesFilter: string[];
    studies: PreventionStudy[];
    onChange: (selection: string[]) => void;
    value: string[];
}

const InsecticideTypeSelector: React.FC<Props> = ({ insecticideClassesFilter, studies, onChange, value }) => {
    const { t } = useTranslation();

    const suggestions = getInsecticideTypes(studies, insecticideClassesFilter);

    return (
        <MultiFilter
            labelPosition="top"
            label={t("common.filters.insecticide_type")}
            options={suggestions}
            onChange={onChange}
            value={value}
            margin={"10px 0px"}
            isClearable={true}
        />
    );
};

export default InsecticideTypeSelector;
