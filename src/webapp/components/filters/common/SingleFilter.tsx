import React from "react";
import { connect } from "react-redux";
import IntegrationReactSelect, { Option } from "../../BasicSelect";
import { logEventAction } from "../../../store/actions/base-actions";
import { FilterRowContainer } from "../Filters";
import { Typography } from "@mui/material";

type OwnProps = {
    labelPosition?: "top" | "middle";
    margin?: string;
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
    labelPosition,
    margin,
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
        <React.Fragment>
            {labelPosition === "top" && (
                <Typography variant="body2" fontWeight={"bold"}>
                    {label}
                </Typography>
            )}
            <FilterRowContainer margin={margin}>
                {labelPosition === "middle" && selection && (
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
        </React.Fragment>
    );
}

export default connect(null, mapDispatchToProps)(SingleFilter);
