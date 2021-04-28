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

export default () => {
    const classes = useStyles({});
    const { t } = useTranslation("treatment");

    return (
        <div>
            <Typography variant={"h6"} className={classes.title}>
                <Trans i18nKey="step2.part1" t={t}>
                    <b>
                        Routine monitoring of the efficacy of artemisinin-based combination therapies (ACTs) is
                        essential to ensure that patients receive effective treatment
                    </b>
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Trans i18nKey="step2.part2" t={t}>
                    <b>
                        WHO recommends that all malaria endemic countries conduct therapeutic efficacy studies at least
                        once every two years to inform treatment policy.
                    </b>
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>{t("step2.part3")}</Typography>
        </div>
    );
};
