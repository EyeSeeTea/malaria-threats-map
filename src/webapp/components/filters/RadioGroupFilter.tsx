import React from "react";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import styled from "styled-components";
import { connect } from "react-redux";
import { Paper } from "@mui/material";
import { Divider, FilterWrapper } from "./Filters";
import FormLabel from "@mui/material/FormLabel";
import { Option } from "../BasicSelect";

const StyledFormControlLabel = styled(FormControlLabel)`
    & span {
        padding: 2px;
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

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: "flex",
        },
        formControl: {
            margin: theme.spacing(3),
        },
        group: {
            padding: theme.spacing(1, 2),
        },
        radio: {
            padding: theme.spacing(0.5, 0),
        },
    })
);

function RadioGroupFilter({ label, options, handleChange, value }: RadioGroupProps) {
    const classes = useStyles({});

    return (
        <FilterWrapper>
            <FormLabel component="legend">{label}</FormLabel>
            <Divider />
            <Paper className={classes.group}>
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
            </Paper>
        </FilterWrapper>
    );
}

export default connect()(RadioGroupFilter);
