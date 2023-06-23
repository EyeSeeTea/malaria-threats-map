import React from "react";
import { useTranslation } from "react-i18next";
import SliderFilter from "../../../../components/filters/common/SliderFilter";

type DashboardsYearRangeSelectorProps = {
    value: number;
    onChange: (value: number) => void;
    isDisabled?: boolean;
};

const OnlyIncludeBioassaysWithMoreMosquitoes: React.FC<DashboardsYearRangeSelectorProps> = ({ value, onChange, isDisabled = false }) => {
    const { t } = useTranslation();

    return (
        <SliderFilter
            label={t("common.filters.onlyIncludeBioassays")}
            minLabel={t("common.filters.zero_all_bioassays")}
            maxLabel={"150+"}
            onChange={onChange}
            value={value}
            min={0}
            max={150}
            background="transparent"
            margin={"10px 0px"}
            padding={"10px 0px"}
            fontWeight={"bold"}
            isDisabled={isDisabled}
        />
    );
};
export default OnlyIncludeBioassaysWithMoreMosquitoes;
