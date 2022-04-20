import React from "react";
import { connect } from "react-redux";
import { FilterRowContainer } from "../Filters";
import FormLabel from "@mui/material/FormLabel";
import { logEventAction } from "../../../store/actions/base-actions";
import { Switch } from "@mui/material";

type OwnProps = {
    label: string;
    onChange: (check: boolean) => void;
    value: boolean;
    analyticsFilterAction?: string;
};

const mapDispatchToProps = {
    logEventAction: logEventAction,
};

type DispatchProps = typeof mapDispatchToProps;
type Props = OwnProps & DispatchProps;

function SwitchFilter({ label, onChange, value, analyticsFilterAction, logEventAction }: Props) {
    const onSelectionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.checked);

        if (analyticsFilterAction) {
            logEventAction({ category: "filter", action: analyticsFilterAction, label: value.toString() });
        }
    };

    return (
        <FilterRowContainer>
            <FormLabel component="legend">{label}</FormLabel>
            <Switch color="primary" checked={value} onChange={onSelectionChange} />
        </FilterRowContainer>
    );
}

export default connect(null, mapDispatchToProps)(SwitchFilter);
