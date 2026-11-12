import React from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import styled from "styled-components";
import { PreventionFilters, State } from "../../store/types";
import { selectPreventionFilters } from "../../store/reducers/prevention-reducer";
import { connect } from "react-redux";
import { setAssayTypes } from "../../store/actions/prevention-actions";
import { Checkbox, FormGroup, Typography } from "@mui/material";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { Divider, FilterColumContainer } from "./Filters";
import { logEventAction } from "../../store/actions/base-actions";
import { sendMultiFilterAnalytics } from "../../utils/analytics";
import { getAssayTypesDetecting } from "../../../domain/entities/ResistanceMechanism";

const StyledFormControlLabel = styled(FormControlLabel)`
    & span {
        padding: 2px;
        font-size: 14px;
    }
`;

const mapStateToProps = (state: State) => ({
    preventionFilters: selectPreventionFilters(state),
});

const mapDispatchToProps = {
    setAssayTypes: setAssayTypes,
    logEventAction: logEventAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

/** The assay types that detect the one selected mechanism, with the xMART label or, without one, the value. */
export function getAssayTypeOptions(preventionFilters: PreventionFilters) {
    const type = preventionFilters.type?.length === 1 ? preventionFilters.type[0] : undefined;

    return (getAssayTypesDetecting(type) ?? []).map(value => ({
        value: value,
        label: i18next.t(`ASSAY_TYPE.${value}`, { defaultValue: value }),
    }));
}

function AssayTypeCheckboxFilter({ preventionFilters, setAssayTypes }: Props) {
    const handleChange = (type: string) => () => {
        let newValues: string[];
        if (preventionFilters.assayTypes.includes(type)) {
            newValues = preventionFilters.assayTypes.filter(assayType => assayType !== type);
        } else {
            newValues = [...preventionFilters.assayTypes, type];
        }
        setAssayTypes(newValues);
        sendMultiFilterAnalytics(
            "assayType",
            preventionFilters.assayTypes,
            newValues.map(value => ({ value }))
        );
    };

    const options = getAssayTypeOptions(preventionFilters);

    const { t } = useTranslation();

    return (
        <FilterColumContainer>
            <Typography component="legend" variant="body2" color={"dimgray"}>
                {t("common.filters.assay_type")}
            </Typography>
            <Divider />
            <FormGroup>
                {options.map(option => (
                    <StyledFormControlLabel
                        key={option.value}
                        control={
                            <Checkbox
                                color="primary"
                                checked={preventionFilters.assayTypes.includes(option.value)}
                                onChange={handleChange(option.value)}
                            />
                        }
                        label={option.label}
                    />
                ))}
            </FormGroup>
        </FilterColumContainer>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(AssayTypeCheckboxFilter);
