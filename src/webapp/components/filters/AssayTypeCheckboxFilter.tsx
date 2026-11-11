import React from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import styled from "styled-components";
import { PreventionFilters, State } from "../../store/types";
import { selectAssayTypes } from "../../store/reducers/translations-reducer";
import { selectPreventionFilters } from "../../store/reducers/prevention-reducer";
import { connect } from "react-redux";
import { setAssayTypes } from "../../store/actions/prevention-actions";
import { Checkbox, FormGroup, Typography } from "@mui/material";
import { Translation } from "../../types/Translation";
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
    assayTypes: selectAssayTypes(state),
    preventionFilters: selectPreventionFilters(state),
});

const mapDispatchToProps = {
    setAssayTypes: setAssayTypes,
    logEventAction: logEventAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

export function getAssayTypeOptions(preventionFilters: PreventionFilters, assayTypes: Translation[]) {
    const type = preventionFilters?.type?.length === 1 ? preventionFilters.type[0] : undefined;

    const types =
        getAssayTypesDetecting(type)
            ?.map(value => (assayTypes as Translation[]).find(type => type.VALUE_ === value))
            .filter(Boolean) || [];

    return types;
}

function AssayTypeCheckboxFilter({ assayTypes, preventionFilters, setAssayTypes }: Props) {
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

    const types = getAssayTypeOptions(preventionFilters, assayTypes);

    const { t } = useTranslation();

    return (
        <FilterColumContainer>
            <Typography component="legend" variant="body2" color={"dimgray"}>
                {t("common.filters.assay_type")}
            </Typography>
            <Divider />
            <FormGroup>
                {types.map(type => (
                    <StyledFormControlLabel
                        key={type.VALUE_}
                        control={
                            <Checkbox
                                color="primary"
                                checked={preventionFilters.assayTypes.includes(type.VALUE_)}
                                onChange={handleChange(type.VALUE_)}
                            />
                        }
                        label={t<string>(type.VALUE_)}
                    />
                ))}
            </FormGroup>
        </FilterColumContainer>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(AssayTypeCheckboxFilter);
