import React from "react";
import { connect } from "react-redux";
import IntegrationReactSelect, { Option } from "../../BasicSelect";
import { FilterRowContainer } from "../Filters";
import { sendMultiFilterAnalytics } from "../../../utils/analytics";
import { Typography } from "@mui/material";

type Props = {
    labelPosition?: "top" | "middle";
    margin?: string;
    label?: string;
    options: Option[];
    placeholder?: string;
    onChange: (selection: string[]) => void;
    value: string[];
    analyticsMultiFilterAction?: string;
    isClearable?: boolean;
    optionsStyle?: React.CSSProperties;
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
    optionsStyle,
}: Props) {
    const onSelectionChange = (options: Option[] = []) => {
        onChange((options || []).map(o => o.value));

        if (analyticsMultiFilterAction) {
            sendMultiFilterAnalytics(analyticsMultiFilterAction, value, options);
        }
    };

    const selections = options.filter(option => value && value.includes(option.value));

    return (
        <React.Fragment>
            {label && labelPosition === "top" && (
                <Typography variant="body2" fontWeight={"bold"}>
                    {label}
                </Typography>
            )}
            <FilterRowContainer margin={margin} className="MultiFilter-container">
                {label && labelPosition === "middle" && selections && selections.length > 0 && (
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
                    optionsStyle={optionsStyle}
                />
            </FilterRowContainer>
        </React.Fragment>
    );
}

export default connect()(MultiFilter);
