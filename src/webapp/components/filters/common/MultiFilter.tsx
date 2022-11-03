import React from "react";
import { connect } from "react-redux";
import IntegrationReactSelect, { Option } from "../../BasicSelect";
import { FilterRowContainer } from "../Filters";
import { sendMultiFilterAnalytics } from "../../../utils/analytics";
import { Typography } from "@mui/material";

type Props = {
    label?: string;
    options: Option[];
    placeholder?: string;
    onChange: (selection: string[]) => void;
    value: string[];
    analyticsMultiFilterAction?: string;
    onlyYMargin?: boolean;
    isClearable?: boolean;
};

function MultiFilter({
    label,
    options,
    onChange,
    value,
    analyticsMultiFilterAction,
    placeholder,
    onlyYMargin,
    isClearable,
}: Props) {
    const onSelectionChange = (options: Option[] = []) => {
        onChange((options || []).map(o => o.value));

        if (analyticsMultiFilterAction) {
            sendMultiFilterAnalytics(analyticsMultiFilterAction, value, options);
        }
    };

    const selections = options.filter(option => value && value.includes(option.value));

    return (
        <FilterRowContainer onlyYMargin={onlyYMargin}>
            {label && selections && selections.length > 0 && (
                <Typography component="legend" variant="body2">
                    {`${label}:`}&nbsp;
                </Typography>
            )}
            <IntegrationReactSelect
                isMulti
                isClearable={isClearable}
                placeholder={placeholder}
                suggestions={options}
                onChange={onSelectionChange}
                value={selections}
            />
        </FilterRowContainer>
    );
}

export default connect()(MultiFilter);
