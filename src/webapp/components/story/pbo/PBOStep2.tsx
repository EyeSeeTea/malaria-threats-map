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

const PBOStep2 = () => {
    const classes = useStyles({});
    const { t } = useTranslation("pbo");

    return (
        <div>
            <Typography variant={"h6"} className={classes.title}>
                <Trans i18nKey="step2.part1" t={t}>
                    <b>Considerations for the deployment of Pyrethroid-PBO nets</b>
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Trans i18nKey="step2.part2" t={t}>
                    Deployment of pyrethroid-PBO nets must only be considered in situations where coverage with
                    effective vector control (primarily LLINs or IRS) will not be reduced; the primary goal must remain
                    the achievement and maintenance of universal coverage for all people at risk of malaria.
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"} className={classes.title}>
                <Trans i18nKey="step2.part3" t={t}>
                    Their deployment should be guided by whether geographical areas of operational relevance (e.g.
                    districts or provinces) – rather than the whole country – meet the criteria specified by WHO and
                    should be considered in the context of resource availability and potential for deployment of
                    alternative malaria control interventions.
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"} className={classes.title}>
                <Trans i18nKey="step2.part4" t={t}>
                    Pyrethroid-PBO nets should not be considered a tool that can alone effectively manage insecticide
                    resistance in malaria vectors.
                </Trans>
            </Typography>
        </div>
    );
};

export default PBOStep2;
