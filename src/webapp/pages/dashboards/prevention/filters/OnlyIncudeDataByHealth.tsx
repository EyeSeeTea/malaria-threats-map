import React from "react";
import { useTranslation } from "react-i18next";
import SwitchFilter from "../../../../components/filters/common/SwitchFilter";

interface OnlyIncudeDataByHealthProps {
    value: boolean;
    onChange: (value: boolean) => void;
}

const OnlyIncudeDataByHealth: React.FC<OnlyIncudeDataByHealthProps> = ({ value, onChange }) => {
    const { t } = useTranslation();

    return (
        <SwitchFilter
            label={t("common.filters.only_include_data_by_health")}
            onChange={onChange}
            value={value}
            background="transparent"
            margin={"10px 0px"}
            padding={"10px 0px"}
            fontWeight={"bold"}
        />
    );
};

export default OnlyIncudeDataByHealth;
