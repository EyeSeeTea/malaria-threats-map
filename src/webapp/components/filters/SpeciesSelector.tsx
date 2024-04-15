import React from "react";
import styled from "styled-components";
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
    hasScroll?: boolean;
};

const SpeciesSelector: React.FC<SpeciesSelectorProps> = ({
    options,
    onChange,
    value,
    labelPosition,
    margin,
    isClearable,
    disabled = false,
    hasScroll = false,
}) => {
    const { t } = useTranslation();

    return (
        <StyledMultiFilter
            labelPosition={labelPosition}
            margin={margin}
            label={t("common.filters.vector_species")}
            options={options}
            onChange={onChange}
            value={value}
            isClearable={isClearable}
            disabled={disabled}
            $hasScroll={hasScroll}
        />
    );
};

export default SpeciesSelector;

const StyledMultiFilter = styled(MultiFilter)<{ $hasScroll: boolean }>`
    .MuiInputBase-input {
        max-height: ${props => (props.$hasScroll ? "400px" : "unset")};
        overflow-y: ${props => (props.$hasScroll ? "scroll" : "unset")};
        div:first-child {
            overflow: ${props => (props.$hasScroll ? "unset" : "hidden")};
        }
    }
`;
