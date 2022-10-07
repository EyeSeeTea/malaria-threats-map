import React from "react";
import { connect } from "react-redux";
import IntegrationReactSelect, { Option } from "../../BasicSelect";
import { logEventAction } from "../../../store/actions/base-actions";
import { FilterRowContainer } from "../Filters";
import { Typography } from "@mui/material";

type OwnProps = {
    label: string;
    options: Option[];
    onChange: (selection?: string) => void;
    value: string;
    analyticsFilterAction?: string;
    placeholder?: string;
    isClearable?: boolean;
    isDisabled?: boolean;
};

const mapDispatchToProps = {
    logEventAction: logEventAction,
};

type DispatchProps = typeof mapDispatchToProps;
type Props = OwnProps & DispatchProps;

function SingleFilter({
    label,
    options,
    onChange,
    value,
    analyticsFilterAction,
    logEventAction,
    placeholder,
    isClearable = true,
    isDisabled = false,
}: Props) {
    const onSelectionChange = (option: Option | undefined) => {
        const selection = option?.value || undefined;

        onChange(selection);

        if (analyticsFilterAction && selection) {
            logEventAction({ category: "filter", action: analyticsFilterAction, label: selection });
        }
    };

    const selection = options.find((s: Option) => s.value === value) || null;

    return (
        <FilterRowContainer>
            {selection && (
                <Typography component="legend" variant="body2">
                    {`${label}:`}&nbsp;
                </Typography>
            )}
            <IntegrationReactSelect
                isMulti={false}
                isClearable={isClearable}
                isDisabled={isDisabled}
                placeholder={placeholder}
                suggestions={options}
                onChange={onSelectionChange}
                value={selection}
            />
        </FilterRowContainer>
    );
}

export default connect(null, mapDispatchToProps)(SingleFilter);
