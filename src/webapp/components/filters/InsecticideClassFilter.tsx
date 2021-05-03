import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import styled from "styled-components";
import { State } from "../../store/types";
import { connect } from "react-redux";
import { Translation } from "../../types/Translation";
import { useTranslation } from "react-i18next";
import { Paper } from "@material-ui/core";
import { selectInsecticideClasses } from "../../store/reducers/translations-reducer";
import { selectFilteredPreventionStudies, selectPreventionFilters } from "../../store/reducers/prevention-reducer";
import { setInsecticideClass } from "../../store/actions/prevention-actions";
import FormLabel from "@material-ui/core/FormLabel";
import { Divider, FilterWrapper } from "./Filters";

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
        formControl: {
            margin: theme.spacing(3),
        },
        group: {
            padding: theme.spacing(1, 2),
        },
        radio: {
            padding: theme.spacing(0.5, 0),
        },
    })
);

const mapStateToProps = (state: State) => ({
    insecticideClasses: selectInsecticideClasses(state),
    preventionFilters: selectPreventionFilters(state),
    filteredStudies: selectFilteredPreventionStudies(state),
});

const mapDispatchToProps = {
    setInsecticideClass: setInsecticideClass,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

export const INSECTICIDE_CLASSES: string[] = [
    "PYRETHROIDS",
    "ORGANOCHLORINES",
    "CARBAMATES",
    "ORGANOPHOSPHATES",
    "PYRROLES",
];

function InsecticideClassFilter({ insecticideClasses = [], preventionFilters, setInsecticideClass }: Props) {
    const classes = useStyles({});

    function handleChange(event: React.ChangeEvent<unknown>) {
        setInsecticideClass((event.target as HTMLInputElement).value);
    }
    const { t } = useTranslation("common");

    return (
        <FilterWrapper>
            <FormLabel component="legend">{t(`filters.insecticide_class`)}</FormLabel>
            <Divider />
            <Paper className={classes.group}>
                <RadioGroup value={preventionFilters.insecticideClass} onChange={handleChange}>
                    {(insecticideClasses as Translation[])
                        .filter(translation => translation.VALUE_ !== "NA")
                        .sort((a, b) =>
                            INSECTICIDE_CLASSES.indexOf(a.VALUE_) - INSECTICIDE_CLASSES.indexOf(b.VALUE_) > 0 ? 1 : -1
                        )
                        .map((insecticideClass: Translation) => (
                            <StyledFormControlLabel
                                key={insecticideClass.VALUE_}
                                value={insecticideClass.VALUE_}
                                control={<Radio color="primary" />}
                                label={t(insecticideClass.VALUE_)}
                            />
                        ))}
                </RadioGroup>
            </Paper>
        </FilterWrapper>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(InsecticideClassFilter);
