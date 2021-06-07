import React from "react";
import { connect } from "react-redux";
import IntegrationReactSelect, { Option } from "../BasicSelect";
import { Divider, FilterWrapper } from "./Filters";
import FormLabel from "@material-ui/core/FormLabel";
import { sendMultiFilterAnalytics } from "../../utils/analytics";

type MultiSelectorProps = {
    label: string;
    options: Option[];
    onChange: (selection: string[]) => void;
    value: string[];
    analyticsAction?: string;
};

function MultiFilter({ label, options, onChange, value, analyticsAction }: MultiSelectorProps) {
    const onSelectionChange = (options: Option[] = []) => {
        onChange((options || []).map(o => o.value));

        if (analyticsAction) {
            sendMultiFilterAnalytics(analyticsAction, value, options);
        }
    };

    const selections = options.filter(option => value.includes(option.value));

    return (
        <FilterWrapper>
            <FormLabel component="legend">{label}</FormLabel>
            <Divider />
            <IntegrationReactSelect
                isMulti
                isClearable={false}
                suggestions={options}
                onChange={onSelectionChange}
                value={selections}
            />
        </FilterWrapper>
    );
}

export default connect()(MultiFilter);
