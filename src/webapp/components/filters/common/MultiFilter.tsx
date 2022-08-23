import React, { CSSProperties } from "react";
import { connect } from "react-redux";
import IntegrationReactSelect, { Option } from "../../BasicSelect";
import { Divider, FilterWrapper } from "../Filters";
import FormLabel from "@material-ui/core/FormLabel";
import { sendMultiFilterAnalytics } from "../../../utils/analytics";

type Props = {
    label: string;
    options: Option[];
    onChange: (selection: string[]) => void;
    value: string[];
    analyticsMultiFilterAction?: string;
    optionsStyle?: CSSProperties;
};

function MultiFilter({ label, options, onChange, value, analyticsMultiFilterAction, optionsStyle }: Props) {
    const onSelectionChange = (options: Option[] = []) => {
        onChange((options || []).map(o => o.value));

        if (analyticsMultiFilterAction) {
            sendMultiFilterAnalytics(analyticsMultiFilterAction, value, options);
        }
    };

    const selections = options.filter(option => value.includes(option.value));

    return (
        <FilterWrapper>
            <FormLabel component="legend">{label}</FormLabel>
            <Divider />
            <IntegrationReactSelect
                isMulti
                isClearable
                suggestions={options}
                onChange={onSelectionChange}
                value={selections}
                optionsStyle={optionsStyle}
            />
        </FilterWrapper>
    );
}

export default connect()(MultiFilter);
