import React from "react";
import { connect } from "react-redux";
import { Study } from "../../../domain/entities/Study";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { TreatmentStudy } from "../../../domain/entities/TreatmentStudy";
import { selectTheme } from "../../store/reducers/base-reducer";
import { State } from "../../store/types";

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
});

type StateProps = ReturnType<typeof mapStateToProps>;

type OwnProps = {
    study: Study;
};
type Props = StateProps & OwnProps;

const SiteTitle: React.FC<Props> = ({ theme, study }) => {
    const { t } = useTranslation();

    const title = React.useMemo(() => {
        const titleItems = [
            study.VILLAGE_NAME || study.SITE_NAME,
            theme === "treatment" ? (study as TreatmentStudy).PROVINCE : "",
            t(study.ISO2 === "NA" ? "common.COUNTRY_NA" : study.ISO2),
        ];
        return titleItems.filter(Boolean).join(", ");
    }, [t, study, theme]);

    return (
        <Typography variant="subtitle1">
            <Box fontWeight="fontWeightBold">{title}</Box>
        </Typography>
    );
};

export default connect(mapStateToProps)(SiteTitle);
