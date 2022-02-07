import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { range } from "../../YearRangeSelector";
import MultiFilter from "../../filters/common/MultiFilter";

type OwnProps = {
    value: number[];
    onChange: (value: number[]) => void;
    minYear?: number;
    maxYear?: number;
};

type Props = OwnProps;

const YearsSelector: React.FC<Props> = ({ value, onChange, minYear, maxYear }) => {
    const { t } = useTranslation();

    const suggestions = minYear === 0 || maxYear === 0 ? [] : range(minYear, maxYear, true).map(year => ({
        label: year.toString(),
        value: year.toString(),
    }));

    const [valueState, setValueState] = useState([]);

    useEffect(() => setValueState(value.map(v => v.toString())), [value]);

    const handleChange = (selection: string[]) => {
        onChange((selection || []).map(s => +s));
    };

    return (
        <MultiFilter
            label={t("common.filters.years")}
            options={suggestions}
            onChange={handleChange}
            value={valueState}
        />
    );
};
export default YearsSelector;
