import React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import styled from "styled-components";
import { connect } from "react-redux";
import { Divider, FilterColumContainer } from "./Filters";
import { Option } from "../BasicSelect";
import { Typography } from "@mui/material";

const StyledFormControlLabel = styled(FormControlLabel)`
    & span {
        padding: 2px;
        font-size: 14px;
    }
    & svg {
        left: 2px;
    }
`;

type RadioGroupProps = {
    label: string;
    labelFontSize?: string;
    labelFontWeight?: string;
    options: Option[];
    handleChange: (event: React.ChangeEvent<unknown>) => void;
    value: string;
    margin?: string;
    padding?: string;
    background?: string;
    isDisabled?: boolean;
};

function RadioGroupFilter({
    label,
    options,
    handleChange,
    value,
    margin,
    padding,
    background,
    labelFontSize,
    labelFontWeight,
    isDisabled = false,
}: RadioGroupProps) {
    return (
        <FilterColumContainer margin={margin} padding={padding} background={background}>
            <Typography
                color="dimgray"
                component="legend"
                fontSize={labelFontSize}
                fontWeight={labelFontWeight}
                variant="body2"
            >
                {label}
            </Typography>
            <Divider />
            <RadioGroup value={value} onChange={handleChange} sx={{ paddingLeft: 2 }}>
                {options.map((option: Option) => (
                    <StyledFormControlLabel
                        key={option.value}
                        value={option.value}
                        control={<Radio />}
                        label={option.label}
                        disabled={isDisabled}
                    />
                ))}
            </RadioGroup>
        </FilterColumContainer>
    );
}

export default connect()(RadioGroupFilter);
