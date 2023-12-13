import React from "react";
import { useTranslation } from "react-i18next";
import MultiFilter from "./common/MultiFilter";
import { Option } from "../BasicSelect";

type SpeciesSelectorProps = {
    options: Option[];
    onChange: (selection: string[]) => void;
    value: string[];
    labelPosition?: "top" | "middle";
    margin?: string;
    isClearable?: boolean;
    disabled?: boolean;
};

const SpeciesSelector: React.FC<SpeciesSelectorProps> = ({
    options,
    onChange,
    value,
    labelPosition,
    margin,
    isClearable,
    disabled = false,
}) => {
    const { t } = useTranslation();

    return (
        <MultiFilter
            labelPosition={labelPosition}
            margin={margin}
            label={t("common.filters.vector_species")}
            options={options}
            onChange={onChange}
            value={value}
            isClearable={isClearable}
            disabled={disabled}
        />
    );
};

export default SpeciesSelector;
