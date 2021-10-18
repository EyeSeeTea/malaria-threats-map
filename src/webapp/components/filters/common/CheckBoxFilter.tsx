import React from "react";
import { connect } from "react-redux";
import { FilterWrapper } from "../Filters";
import FormLabel from "@material-ui/core/FormLabel";
import { logEventAction } from "../../../store/actions/base-actions";
import { Checkbox } from "@material-ui/core";

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
        <FilterWrapper>
            <FormLabel component="legend">{label}</FormLabel>
            <Checkbox color="primary" checked={value} onChange={onSelectionChange} />
        </FilterWrapper>
    );
}

export default connect(null, mapDispatchToProps)(CheckBoxFilter);
