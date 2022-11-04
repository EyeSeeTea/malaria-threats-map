import React from "react";
import { Option } from "../types";
import Select from "react-select";
import { scrollToSection } from "../country-context/utils";

const selectStyles = {
    control: (base: any) => ({
        ...base,
        fontSize: "10px",
        textTransform: "uppercase",
        fontWeight: "bold",
    }),
    menu: (base: any) => ({
        ...base,
        fontSize: "10px",
        textTransform: "uppercase",
        fontWeight: "bold",
    }),
};

interface DashboardContentFilterProps<T> {
    options: Option<T>[];
    value: T;
    onChange: (value: T) => void;
}

function DashboardContentFilter<T>({ options, value, onChange }: DashboardContentFilterProps<T>) {
    const handleChange = React.useCallback(
        (option: Option<T>) => {
            scrollToSection(option.value as unknown as string);
            onChange(option.value);
        },
        [onChange]
    );

    const optionValue = React.useMemo(() => options.find(item => item.value === value), [options, value]);

    return <Select options={options} value={optionValue} onChange={handleChange} styles={selectStyles} />;
}

export default DashboardContentFilter;
