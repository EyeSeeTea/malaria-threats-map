import React from "react";
import { connect } from "react-redux";
import IntegrationReactSelect, { Option } from "../../BasicSelect";
import { FilterRowContainer } from "../Filters";
import { sendMultiFilterAnalytics } from "../../../utils/analytics";
import { Typography } from "@mui/material";
import styled from "styled-components";

type Props = {
    labelPosition?: "top" | "middle";
    margin?: string;
    label?: string;
    options: Option[];
    placeholder?: string;
    onChange: (selection: string[]) => void;
    value: string[];
    analyticsMultiFilterAction?: string;
    isClearable?: boolean;
    disabled?: boolean;
    optionsStyle?: React.CSSProperties;
    className?: string;
};

function MultiFilter({
    labelPosition = "middle",
    label,
    options,
    onChange,
    value,
    analyticsMultiFilterAction,
    placeholder,
    isClearable = false,
    margin,
    optionsStyle,
    disabled = false,
    className = "",
}: Props) {
    const onSelectionChange = (options: Option[] = []) => {
        onChange((options || []).map(o => o.value));

        if (analyticsMultiFilterAction) {
            sendMultiFilterAnalytics(analyticsMultiFilterAction, value, options);
        }
    };

    const selections = options.filter(option => value && value.includes(option.value));

    return (
        <React.Fragment>
            {label && labelPosition === "top" && (
                <StyledTypography variant="body2" $disabled={disabled}>
                    {label}
                </StyledTypography>
            )}
            <StyledFilterRowContainer margin={margin} className="MultiFilter-container" $disabled={disabled}>
                {label && labelPosition === "middle" && selections && selections.length > 0 && (
                    <Typography component="legend" variant="body2">
                        {`${label}:`}&nbsp;
                    </Typography>
                )}
                <IntegrationReactSelect
                    isMulti
                    isClearable={isClearable}
                    placeholder={placeholder}
                    suggestions={options}
                    onChange={onSelectionChange}
                    value={selections}
                    optionsStyle={optionsStyle}
                    className={className}
                    isDisabled={disabled}
                />
            </StyledFilterRowContainer>
        </React.Fragment>
    );
}

export default connect()(MultiFilter);

const StyledTypography = styled(Typography)<{ $disabled?: boolean }>`
    font-weight: bold;
    color: ${props => props.$disabled && "#999999"};
`;

const StyledFilterRowContainer = styled(FilterRowContainer)<{ $disabled?: boolean }>`
    color: ${props => props.$disabled && "#999999"};
    span {
        color: ${props => props.$disabled && "#999999"};
    }
`;
