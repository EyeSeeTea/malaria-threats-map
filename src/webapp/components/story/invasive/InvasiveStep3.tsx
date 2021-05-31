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
const InvasiveStep3 = () => {
    const classes = useStyles({});
    const { t } = useTranslation();
    
    return (
        <div>
            <Typography variant={"h6"} className={classes.title}>
                <Trans i18nKey="invasiveStory.step3.part1" t={t}>
                    <b>
                        Control strategies should be informed by best practices from other countries, be adequately
                        monitored and evaluated, and be modified where required.
                    </b>
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Trans i18nKey="invasiveStory.step3.part2" t={t}>
                    <b>
                        Invasive vector species may adapt to their new environment by changing their traditional
                        behaviours, including their choice of breeding habitats and resting sites, and may become
                        insecticide resistant when exposed to vector control interventions.
                    </b>
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Trans i18nKey="invasiveStory.step3.part3" t={t}>
                    National programmes aiming to control and eliminate invasive vector species, should initially draw
                    on best practices from countries where the species is indigenous and has been successfully
                    controlled. However, due to the potential adaptive behavioural changes of vector species, programmes
                    should continuously monitor and evaluate the effectiveness of the deployed vector control
                    interventions to inform strategic adjustments when required.
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Trans i18nKey="invasiveStory.step3.part4" t={t}>
                    The WHO recommends that national malaria control programs, and their executive partners, record
                    lessons learned and send them to WHO (
                </Trans>
                <Link href="mailto:vectorsurveillance@who.int" color={"textSecondary"}>
                    vectorsurveillance@who.int
                </Link>
                <Trans i18nKey="invasiveStory.step3.part5" t={t}>
                    ) in order to contribute to the development of a plan based on evidence for the control and
                    eradication of vector and invasive species of malaria.
                </Trans>
            </Typography>
        </div>
    );
};

export default InvasiveStep3;
