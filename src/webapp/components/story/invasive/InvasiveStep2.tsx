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

const InvasiveStep2 = () => {
    const classes = useStyles({});
    const { t } = useTranslation("invasive");
    return (
        <div>
            <Typography variant={"h6"} className={classes.title}>
                <Trans i18nKey="step2.part1" t={t}>
                    <b>Timely detection of invasive vector species is crucial to contain their spread.</b>
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Trans i18nKey="step2.part2" t={t}>
                    <b>
                        Entomological surveillance systems provide critical information to inform the design and
                        implementation of vector control strategies.
                    </b>
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Trans i18nKey="step2.part3" t={t}>
                    Understanding vector species’ breeding and resting habitats, behaviour, feeding preferences and
                    resistance status is required to design effective interventions to prevent further spread of
                    invasive vector species and establishment in new geographical areas.
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Trans i18nKey="step2.part4" t={t}>
                    WHO recommends that all malaria endemic countries conduct entomological surveillance and report
                    detection of suspected invasive species to WHO by filling and sending the
                </Trans>
                <Link target="_blank" href={t("step2.link")} color={"textSecondary"}>
                    <Trans i18nKey="step2.whoForm" t={t}>
                        WHO form to report detection of invasive Anopheles vector species to
                    </Trans>
                </Link>
                <Link href="mailto:vectorsurveillance@who.int" color={"textSecondary"}>
                    vectorsurveillance@who.int
                </Link>
                .
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Trans i18nKey="step2.part5" t={t}>
                    Key indicators for entomological surveillance entomological surveillance are listed in chapter 5 of
                    the
                </Trans>
                <Link
                    target="_blank"
                    href="https://www.who.int/malaria/publications/atoz/9789241565578/en/"
                    color={"textSecondary"}
                >
                    <Trans i18nKey="step2.whoManual" t={t}>
                        WHO Malaria Surveillance, monitoring and evaluation: a reference manual.
                    </Trans>
                </Link>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Link
                    href="https://www.who.int/publications/i/item/9789241565578"
                    target="_blank"
                    color={"textSecondary"}
                >
                    <img src="https://www.who.int/malaria/publications/atoz/978921565578-eng.jpg" alt="supporting" />
                </Link>
            </Typography>
        </div>
    );
};

export default InvasiveStep2;
