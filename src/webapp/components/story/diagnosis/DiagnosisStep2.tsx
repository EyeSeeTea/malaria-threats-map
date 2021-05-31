import React from "react";
import Typography from "@material-ui/core/Typography";
import { createStyles, Link, makeStyles } from "@material-ui/core";
import { useTranslation, Trans } from "react-i18next";

const useStyles = makeStyles(() =>
    createStyles({
        title: {
            lineHeight: 1.3,
        },
    })
);
const DiagnosisStep2 = () => {
    const classes = useStyles({});
    const { t } = useTranslation();

    return (
        <div>
            <Typography variant={"h6"} className={classes.title}>
                <Trans i18nKey="diagnosisStory.step2.part1" t={t}>
                    <b>
                        <i>pfhrp2/3</i> gene deletions may have significant implications for public health
                    </b>
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Trans i18nKey="diagnosisStory.step2.part2" t={t}>
                    False negative RDT results due to <i>pfhrp2/3</i> deletions can lead to incorrect or delayed
                    diagnosis and threaten patient safety. The patient may also continue to be a source of malaria
                    transmission until properly treated.
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Trans i18nKey="diagnosisStory.step2.part3" t={t}>
                    Since 2010, surveys in several settings in Africa and Asia have also found a varying proportion of{" "}
                    <i>P. falciparum</i> parasites lacking the <i>pfhrp2</i> gene. The prevalence of this genetic
                    mutation reportedly varies between and within countries. If confirmed, RDT procurement and case
                    management practices need to be tailored accordingly. WHO recommends a change to an RDT that is not
                    exclusively based on HRP2 for <i>P. falciparum</i> detection (ie. pf-pLDH) if the prevalence of
                    false negative RDTs due to <i>pfhrp2</i> deletion is ≥ 5% amongst symptomatic patients.
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Link href={t("diagnosisStory.step2.link")} target="_blank" color={"textSecondary"}>
                    <Trans i18nKey="diagnosisStory.step2.supportingStudies" t={t}>
                        Link to supporting studies.
                    </Trans>
                </Link>
            </Typography>
        </div>
    );
};

export default DiagnosisStep2;
