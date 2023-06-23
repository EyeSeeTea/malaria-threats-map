import React from "react";
import { useTranslation } from "react-i18next";
import SwitchFilter from "./common/SwitchFilter";

interface ExcludeLowerSamplesSelectorProps {
    value: boolean;
    onChange: (value: boolean) => void;
    fontWeight?: string;
}

const ExcludeLowerSamplesSelector: React.FC<ExcludeLowerSamplesSelectorProps> = ({ value, onChange, fontWeight }) => {
    const { t } = useTranslation();

    return (
        <SwitchFilter
            label={t("common.filters.exclude_lower_samples")}
            onChange={onChange}
            value={value}
            background="transparent"
            margin={"10px 0px"}
            padding={"10px 0px"}
            fontWeight={fontWeight}
        />
    );
};

export default ExcludeLowerSamplesSelector;
