import React from "react";
import Typography from "@mui/material/Typography";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import { useTranslation, Trans } from "react-i18next";

const useStyles = makeStyles(() =>
    createStyles({
        title: {
            lineHeight: 1.3,
        },
    })
);

const TreatmentStep1 = () => {
    const classes = useStyles({});
    const { t } = useTranslation();

    return (
        <div>
            <Typography variant={"h6"} className={classes.title}>
                <Trans i18nKey="treatmentStory.step1.part1" t={t}>
                    <b>Malaria parasites repeatedly develop resistance to antimalarial treatment</b>
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Trans i18nKey="treatmentStory.step1.part2" t={t}>
                    <b>For decades, drug resistance has been one of the main obstacles in the fight against malaria.</b>
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Trans i18nKey="treatmentStory.step1.part3" t={t}>
                    Continuous global monitoring and reporting of drug efficacy and parasite resistance is critical to
                    ensure patients receive effective treatment. WHO supports national malaria control programmes to
                    monitor antimalarial treatment efficacy and to track the genetic changes linked to drug resistance
                    in malaria parasites.
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Trans i18nKey="treatmentStory.step1.part4" t={t}>
                    The critical role of monitoring drug efficacy has been observed worldwide. Resistance has been a
                    persistent challenge in the Greater Mekong Subregion. The region has been very active in monitoring
                    drug efficacy.
                </Trans>
            </Typography>
        </div>
    );
};

export default TreatmentStep1;
