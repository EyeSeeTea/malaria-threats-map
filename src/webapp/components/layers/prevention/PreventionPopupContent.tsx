import React from "react";
import { useTranslation } from "react-i18next";
import { State } from "../../../store/types";
import { connect } from "react-redux";
import { PreventionStudy } from "../../../../domain/entities/PreventionStudy";
import { selectTheme } from "../../../store/reducers/base-reducer";
import { Box, Typography } from "@mui/material";
import ViewSummaryDataButton from "../../ViewSummaryDataButton";


const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
});

type OwnProps = {
    studyObject: PreventionStudy;
};

type StateProps = ReturnType<typeof mapStateToProps>;

type Props = StateProps & OwnProps;

const PreventionPopupContent = ({ studyObject }: Props) => {
    const { t } = useTranslation();

    return (
        <>
        <Typography variant="subtitle1">
                <Box fontWeight="fontWeightBold">{`${studyObject.VILLAGE_NAME}, ${t(
                    studyObject.ISO2 === "NA" ? "common.COUNTRY_NA" : studyObject.ISO2
                )}`}</Box>
            </Typography>
            <Typography variant="subtitle2">{`${t(studyObject.ASSAY_TYPE)}, ${t(studyObject.TYPE)}`}</Typography>
            <ViewSummaryDataButton />
        </>
    )
};

export default connect(mapStateToProps)(PreventionPopupContent);

