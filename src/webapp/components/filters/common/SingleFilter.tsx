import React from "react";
import { connect } from "react-redux";
import IntegrationReactSelect, { Option } from "../../BasicSelect";
import { Divider, FilterWrapper } from "../Filters";
import FormLabel from "@material-ui/core/FormLabel";
import { logEventAction } from "../../../store/actions/base-actions";

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
        <FilterWrapper>
            <FormLabel component="legend">{label}</FormLabel>
            <Divider />
            <IntegrationReactSelect
                isMulti={false}
                isClearable={isClearable}
                isDisabled={isDisabled}
                placeholder={placeholder}
                suggestions={options}
                onChange={onSelectionChange}
                value={selection}
            />
        </FilterWrapper>
    );
}

export default connect(null, mapDispatchToProps)(SingleFilter);
