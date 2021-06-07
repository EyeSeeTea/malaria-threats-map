import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { range } from "../../YearRangeSelector";
import MultiFilter from "../../filters/MultiFilter";

const min = 1988;
const max = new Date().getFullYear();

const suggestions = range(min, max, true).map(year => ({
    label: year.toString(),
    value: year.toString(),
}));

type OwnProps = {
    value: number[];
    onChange: (value: number[]) => void;
};

type Props = OwnProps;

const YearsSelector = ({ value, onChange }: Props) => {
    const { t } = useTranslation("common");

    const [valueState, setValueState] = useState([]);

    useEffect(() => setValueState(value.map(v => v.toString())), [value]);

    const handleChange = (selection: string[]) => {
        onChange((selection || []).map(s => +s));
    };

    return <MultiFilter label={t("filters.years")} options={suggestions} onChange={handleChange} value={valueState} />;
};
export default YearsSelector;
