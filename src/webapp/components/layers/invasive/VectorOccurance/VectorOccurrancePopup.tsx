import * as React from "react";
import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { connect } from "react-redux";
import { selectTheme } from "../../../../store/reducers/base-reducer";
import { State } from "../../../../store/types";
import * as R from "ramda";
import { useTranslation } from "react-i18next";
import { InvasiveStudy } from "../../../../../domain/entities/InvasiveStudy";

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
});

type StateProps = ReturnType<typeof mapStateToProps>;
type OwnProps = {
    studies: InvasiveStudy[];
};
type Props = StateProps & OwnProps;

const VectorOccurrencePopup = ({ studies }: Props) => {
    const { t } = useTranslation();

    const [study, setStudy] = useState(0);
    const sortedStudies = R.sortBy(study => -parseInt(study.YEAR_START), studies);

    const studyObject = sortedStudies[study];
    return (
        <>
            <Typography variant="subtitle1">
                <Box fontWeight="fontWeightBold">{`${studyObject.VILLAGE_NAME}, ${t(
                    studyObject.ISO2 === "NA" ? "common.COUNTRY_NA" : studyObject.ISO2
                )}`}</Box>
            </Typography>
        </>
    );
};
export default connect(mapStateToProps)(VectorOccurrencePopup);
