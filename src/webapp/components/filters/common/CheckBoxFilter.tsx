import React from "react";
import { connect } from "react-redux";
import { FilterColumContainer } from "../Filters";
import FormLabel from "@mui/material/FormLabel";
import { logEventAction } from "../../../store/actions/base-actions";
import { Checkbox } from "@mui/material";

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

function CheckBoxFilter({ label, onChange, value, analyticsFilterAction, logEventAction }: Props) {
    const onSelectionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.checked);

        if (analyticsFilterAction) {
            logEventAction({ category: "filter", action: analyticsFilterAction, label: value.toString() });
        }
    };

    return (
        <FilterColumContainer>
            <FormLabel component="legend">{label}</FormLabel>
            <Checkbox color="primary" checked={value} onChange={onSelectionChange} />
        </FilterColumContainer>
    );
}

export default connect(null, mapDispatchToProps)(CheckBoxFilter);
