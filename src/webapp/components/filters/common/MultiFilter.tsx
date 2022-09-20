import React from "react";
import { connect } from "react-redux";
import IntegrationReactSelect, { Option } from "../../BasicSelect";
import { FilterRowContainer } from "../Filters";
import FormLabel from "@mui/material/FormLabel";
import { sendMultiFilterAnalytics } from "../../../utils/analytics";
import { Typography } from "@mui/material";

type Props = {
    labelPosition?: "top" | "middle";
    label: string;
    options: Option[];
    placeholder?: string;
    onChange: (selection: string[]) => void;
    value: string[];
    analyticsMultiFilterAction?: string;
    isClearable?: boolean;
    margin?: string;
};

function MultiFilter({
    labelPosition = "middle",
    label,
    options,
    onChange,
    value,
    analyticsMultiFilterAction,
    placeholder,
    isClearable = false,
    margin,
}: Props) {
    const onSelectionChange = (options: Option[] = []) => {
        onChange((options || []).map(o => o.value));

        if (analyticsMultiFilterAction) {
            sendMultiFilterAnalytics(analyticsMultiFilterAction, value, options);
        }
    };

    const selections = options.filter(option => value.includes(option.value));

    return (
        <React.Fragment>
            {labelPosition === "top" && (
                <Typography variant="body2" fontWeight={"bold"}>
                    {label}
                </Typography>
            )}
            <FilterRowContainer margin={margin}>
                {labelPosition === "middle" && selections && selections.length > 0 && (
                    <FormLabel color="primary" component="legend">
                        {`${label}:`}&nbsp;
                    </FormLabel>
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
        </React.Fragment>
    );
}

export default connect()(MultiFilter);
