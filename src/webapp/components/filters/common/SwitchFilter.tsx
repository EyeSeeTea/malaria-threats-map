import React from "react";
import { connect } from "react-redux";
import { FilterRowContainer } from "../Filters";
import { logEventAction } from "../../../store/actions/base-actions";
import { Switch, Typography } from "@mui/material";

type OwnProps = {
    label: string;
    onChange: (check: boolean) => void;
    value: boolean;
    analyticsFilterAction?: string;
    background?: string;
    fontWeight?: string;
    margin?: string;
    padding?: string;
    isDisabled?: boolean;
};

const mapDispatchToProps = {
    logEventAction: logEventAction,
};

type DispatchProps = typeof mapDispatchToProps;
type Props = OwnProps & DispatchProps;

function SwitchFilter({
    label,
    onChange,
    value,
    analyticsFilterAction,
    logEventAction,
    background,
    fontWeight,
    margin,
    padding,
    isDisabled = false,
}: Props) {
    const onSelectionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.checked);

        if (analyticsFilterAction) {
            logEventAction({ category: "filter", action: analyticsFilterAction, label: value.toString() });
        }
    };

    return (
        <FilterRowContainer background={background} margin={margin} padding={padding}>
            <Typography variant="body2" fontWeight={fontWeight}>
                {label}
            </Typography>
            <Switch color="primary" checked={value} onChange={onSelectionChange} disabled={isDisabled}/>
        </FilterRowContainer>
    );
}

export default connect(null, mapDispatchToProps)(SwitchFilter);
