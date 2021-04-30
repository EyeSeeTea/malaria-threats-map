import React from "react";
import Typography from "@material-ui/core/Typography";
import { createStyles, makeStyles } from "@material-ui/core";
import { useTranslation, Trans } from "react-i18next";

const useStyles = makeStyles(() =>
    createStyles({
        title: {
            lineHeight: 1.3,
        },
    })
);

const TreatmentStep2 = () => {
    const classes = useStyles({});
    const { t } = useTranslation("treatment");

    return (
        <div>
            <Typography variant={"h6"} className={classes.title}>
                <Trans i18nKey="step2.part1">
                    <b>
                        Routine monitoring of the efficacy of artemisinin-based combination therapies (ACTs) is
                        essential to ensure that patients receive effective treatment
                    </b>
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Trans i18nKey="step2.part2">
                    <b>
                        WHO recommends that all malaria endemic countries conduct therapeutic efficacy studies at least
                        once every two years to inform treatment policy.
                    </b>
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Trans i18nKey="step2.part3" t={t}>
                    The selection of the recommended antimalarial drug is based on the medicine’s efficacy against the
                    malaria parasite. As such, monitoring the therapeutic efficacy of antimalarial medicine is a
                    fundamental component of malaria treatment strategies. WHO has developed a standard protocol for
                    monitoring the treatment efficacy of antimalarial medicine.
                </Trans>
            </Typography>
        </div>
    );
};

export default TreatmentStep2;
