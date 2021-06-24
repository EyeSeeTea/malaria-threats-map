import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import styled from "styled-components";
import { connect } from "react-redux";
import { Translation } from "../../types/Translation";
import { useTranslation } from "react-i18next";
import { Paper } from "@material-ui/core";
import { Divider, FilterWrapper } from "./Filters";
import FormLabel from "@material-ui/core/FormLabel";

const StyledFormControlLabel = styled(FormControlLabel)`
    & span {
        padding: 2px;
    }
`;

type RadioGroupProps = {
    label: string;
    options: Translation[];
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
    const { t } = useTranslation();

    return (
        <FilterWrapper>
            <FormLabel component="legend">{label}</FormLabel>
            <Divider />
            <Paper className={classes.group}>
                <RadioGroup value={value} onChange={handleChange}>
                    {options.map((insecticideClass: Translation) => (
                        <StyledFormControlLabel
                            key={insecticideClass.VALUE_}
                            value={insecticideClass.VALUE_}
                            control={<Radio color="primary" />}
                            label={t(insecticideClass.VALUE_)}
                        />
                    ))}
                </RadioGroup>
            </Paper>
        </FilterWrapper>
    );
}

export default connect()(RadioGroupFilter);
