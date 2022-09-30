import React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import styled from "styled-components";
import { connect } from "react-redux";
import { Divider, FilterColumContainer } from "./Filters";
import FormLabel from "@mui/material/FormLabel";
import { Option } from "../BasicSelect";

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
    options: Option[];
    handleChange: (event: React.ChangeEvent<unknown>) => void;
    value: string;
};

function RadioGroupFilter({ label, options, handleChange, value }: RadioGroupProps) {
    return (
        <FilterColumContainer>
            <FormLabel color="primary" component="legend" sx={{ fontSize: "14px" }}>
                {label}
            </FormLabel>
            <Divider />
            <RadioGroup value={value} onChange={handleChange}>
                {options.map((option: Option) => (
                    <StyledFormControlLabel
                        key={option.value}
                        value={option.value}
                        control={<Radio />}
                        label={option.label}
                    />
                ))}
            </RadioGroup>
        </FilterColumContainer>
    );
}

export default connect()(RadioGroupFilter);
