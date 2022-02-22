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

const TreatmentStep4 = () => {
    const classes = useStyles({});
    const { t } = useTranslation();

    return (
        <div>
            <Typography variant={"h6"} className={classes.title}>
                <Trans i18nKey="treatmentStory.step4.part1" t={t}>
                    <b>
                        Drug resistance is a challenge in both <i>P. vivax</i> and
                        <i>P. falciparum</i>, the two most common human malaria parasite species
                    </b>
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Trans i18nKey="treatmentStory.step4.part2" t={t}>
                    <b>
                        Up-to-date information on drug resistance for both <i>P. vivax</i> and
                        <i>P. falciparum</i> malaria is critical.
                    </b>
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Trans i18nKey="treatmentStory.step4.part3" t={t}>
                    Artemisinin-based combination therapies (ACTs) are the recommended treatment for the most deadly
                    malaria parasite, <i>P. falciparum</i>. There are two key outcome measures for monitoring the
                    efficacy of ACTs: (1) the proportion of treatment failures and, (2) the proportion of patients with
                    parasites on the third day after starting treatment. An increase in the proportion of patients with
                    parasites on day 3 is a warning sign of artemisinin resistance.
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Trans i18nKey="treatmentStory.step4.part4" t={t}>
                    Chloroquine is still used in many places to treat <i>P. vivax</i>
                    malaria. However, as chloroquine resistance is also developing in
                    <i>P. vivax</i> parasites, some countries have shifted to ACTs for treating <i>P. vivax</i> malaria.
                </Trans>
            </Typography>
        </div>
    );
};

export default TreatmentStep4;
