import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import styled from "styled-components";
import { State } from "../../store/types";
import { selectAssayTypes } from "../../store/reducers/translations-reducer";
import { selectPreventionFilters } from "../../store/reducers/prevention-reducer";
import { connect } from "react-redux";
import { setAssayTypes } from "../../store/actions/prevention-actions";
import { Checkbox, FormGroup, Paper } from "@material-ui/core";
import { Translation } from "../../types/Translation";
import { useTranslation } from "react-i18next";
import { Divider, FilterWrapper } from "./Filters";
import FormLabel from "@material-ui/core/FormLabel";
import { logEventAction } from "../../store/actions/base-actions";
import { sendMultiFilterAnalytics } from "../../utils/analytics";

export const ASSAY_TYPES = ["MOLECULAR_ASSAY", "BIOCHEMICAL_ASSAY", "SYNERGIST-INSECTICIDE_BIOASSAY"];

const ASSAY_TYPE_FILTER: { [key: string]: string[] } = {
    MONO_OXYGENASES: ASSAY_TYPES,
    ESTERASES: ASSAY_TYPES,
    GSTS: ASSAY_TYPES,
    KDR_L1014S: ["MOLECULAR_ASSAY"],
    KDR_L1014F: ["MOLECULAR_ASSAY"],
    "KDR_(MUTATION_UNSPECIFIED)": ["MOLECULAR_ASSAY"],
    ACE1R: ["MOLECULAR_ASSAY", "BIOCHEMICAL_ASSAY"],
};

const StyledFormControlLabel = styled(FormControlLabel)`
    & span {
        padding: 2px;
    }
`;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: "flex",
        },
        group: {
            padding: theme.spacing(1, 2),
        },
        checkbox: {
            padding: theme.spacing(0.5, 0),
        },
    })
);

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

function AssayTypeCheckboxFilter({ assayTypes, preventionFilters, setAssayTypes }: Props) {
    const classes = useStyles({});

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

    const types = ASSAY_TYPE_FILTER[preventionFilters.type]
        .map(value => (assayTypes as Translation[]).find(type => type.VALUE_ === value))
        .filter(Boolean);

    const { t } = useTranslation("common");

    return (
        <FilterWrapper>
            <FormLabel component="legend">{t("filters.assay_type")}</FormLabel>
            <Divider />
            <Paper className={classes.group}>
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
                            label={t(type.VALUE_)}
                        />
                    ))}
                </FormGroup>
            </Paper>
        </FilterWrapper>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(AssayTypeCheckboxFilter);
