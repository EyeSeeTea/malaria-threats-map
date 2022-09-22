import React from "react";
import { useTranslation } from "react-i18next";
import SwitchFilter from "./common/SwitchFilter";

interface ExcludeLowerPatientsSelectorProps {
    value: boolean;
    onChange: (value: boolean) => void;
    fontWeight?: string;
}

const ExcludeLowerPatientsSelector: React.FC<ExcludeLowerPatientsSelectorProps> = ({ value, onChange, fontWeight }) => {
    const { t } = useTranslation();

    return (
        <SwitchFilter
            label={t("common.filters.exclude_lower_patients")}
            onChange={onChange}
            value={value}
            background="transparent"
            onlyYMargin
            onlyYPadding
            fontWeight={fontWeight}
        />
    );
};

export default ExcludeLowerPatientsSelector;
