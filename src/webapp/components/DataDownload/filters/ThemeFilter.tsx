import React from "react";
import { State } from "../../../store/types";
import { connect } from "react-redux";
import { FormLabel } from "@material-ui/core";
import { Divider, FilterWrapper } from "../../filters/Filters";
import T from "../../../translations/T";
import IntegrationReactSelect from "../../BasicSelect";
import { useTranslation } from "react-i18next";

const THEMES = [
    {
        label: "common.themes.prevention",
        value: "prevention",
    },
    {
        label: "common.themes.treatment",
        value: "treatment",
    },
    {
        label: "common.themes.invasive",
        value: "invasive",
    },
];
const mapStateToProps = (_state: State) => ({});

type OwnProps = {
    value: string;
    onChange: (value: string) => void;
};

type StateProps = ReturnType<typeof mapStateToProps>;
type Props = StateProps & OwnProps;

function ThemeFilter({ value, onChange }: Props) {
    const { t } = useTranslation();
    const suggs = THEMES.map(s => ({ label: t(s.label), value: s.value }));
    return (
        <FilterWrapper>
            <FormLabel component="legend">
                <T i18nKey={"common.data_download.step3.filters.theme"} /> *
            </FormLabel>
            <Divider />
            <IntegrationReactSelect
                suggestions={suggs}
                onChange={(selection: any) => {
                    return onChange(selection.value);
                }}
                value={THEMES.find(theme => theme.value === value)}
            />
        </FilterWrapper>
    );
}

export default connect(mapStateToProps)(ThemeFilter);
