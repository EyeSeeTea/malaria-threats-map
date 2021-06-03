import React from "react";
import { connect } from "react-redux";
import IntegrationReactSelect, { Option } from "../BasicSelect";
import { Divider, FilterWrapper } from "./Filters";
import FormLabel from "@material-ui/core/FormLabel";

type MultiSelectorProps = {
    label: string;
    options: Option[];
    onChange: (selection: string[]) => void;
    value: string[];
};

function MultiSelector({ label, options, onChange, value }: MultiSelectorProps) {
    const onSelectionChange = (options: Option[] = []) => {
        onChange((options || []).map(o => o.value));
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

export default connect()(MultiSelector);
