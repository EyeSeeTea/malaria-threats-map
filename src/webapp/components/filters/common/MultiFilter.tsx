import React from "react";
import { connect } from "react-redux";
import IntegrationReactSelect, { Option } from "../../BasicSelect";
import { FilterRowContainer } from "../Filters";
import FormLabel from "@mui/material/FormLabel";
import { sendMultiFilterAnalytics } from "../../../utils/analytics";

type Props = {
    label: string;
    options: Option[];
    placeholder?: string;
    onChange: (selection: string[]) => void;
    value: string[];
    analyticsMultiFilterAction?: string;
};

function MultiFilter({ label, options, onChange, value, analyticsMultiFilterAction, placeholder }: Props) {
    const onSelectionChange = (options: Option[] = []) => {
        onChange((options || []).map(o => o.value));

        if (analyticsMultiFilterAction) {
            sendMultiFilterAnalytics(analyticsMultiFilterAction, value, options);
        }
    };

    const selections = options.filter(option => value.includes(option.value));

    return (
        <FilterRowContainer onlyYMargin>
            {selections && selections.length > 0 && (
                <FormLabel color="primary" component="legend">
                    {`${label}:`}&nbsp;
                </FormLabel>
            )}
            <IntegrationReactSelect
                isMulti
                isClearable={false}
                placeholder={placeholder}
                suggestions={options}
                onChange={onSelectionChange}
                value={selections}
            />
        </FilterRowContainer>
    );
}

export default connect()(MultiFilter);
