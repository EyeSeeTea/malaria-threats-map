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
const DiagnosisStep3 = () => {
    const classes = useStyles({});
    const { t } = useTranslation();
    
    return (
        <div>
            <Typography variant={"h6"} className={classes.title}>
                <Trans i18nKey="diagnosisStory.step3.part1" t={t}>
                    <b>
                        Increased monitoring of <i>P. falciparum</i> populations for <i>pfhrp2/3</i> gene deletions is
                        essential
                    </b>
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Trans i18nKey="diagnosisStory.step3.part2" t={t}>
                    Once&nbsp;<i>pfhrp2/3</i>&nbsp;deletions are confirmed in a geographical region, surveys should be
                    conducted locally and in neighbouring areas to estimate the prevalence of the parasites carrying
                    gene deletions. In clinical settings the cause(s) of false negative RDTs should be investigated.
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Trans i18nKey="diagnosisStory.step3.part3" t={t}>
                    Sentinel surveillance should be instituted with all findings (positive and negative) reported. Data
                    must be managed well to help prioritize surveys, adequately monitoring trends over time, and to
                    inform a coordinated response.
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Trans i18nKey="diagnosisStory.step3.part4" t={t}>
                    As of 2018, the WHO database includes <i>pfhrp2/3</i> gene deletion data for 29 countries across
                    five WHO regions
                </Trans>
            </Typography>
        </div>
    );
};

export default DiagnosisStep3;
