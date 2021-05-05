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

const TreatmentStep3 = () => {
    const classes = useStyles({});
    const { t } = useTranslation("treatment");

    return (
        <div>
            <Typography variant={"h6"} className={classes.title}>
                <Trans i18nKey="step3.part1" t={t}>
                    <b>
                        Studies of molecular prevention provide essential data for detecting and tracking antimalarial
                        drug resistance
                    </b>
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Trans i18nKey="step3.part2" t={t}>
                    <b>
                        Molecular prevention for drug resistance are genetic changes in the malaria parasite found to be
                        associated with resistance.
                    </b>
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Trans i18nKey="step3.part3" t={t}>
                    Compared to efficacy studies, studies of molecular prevention have several practical advantages. For
                    example, a large number of samples can be collected and rapidly analysed. Molecular prevention of
                    drug resistance have been identified for different drugs, including
                    <i>P. falciparum</i> resistance to chloroquine pipearquine, mefloquine, pyrimethamine, sulfadoxine,
                    atovaquone and artemisinins.
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Trans i18nKey="step3.part4" t={t}>
                    For artemisinins, several mutations in the Kelch 13 (K13)-propeller domain have been found to be
                    associated with delayed parasite clearance. This is an evolving field as more K13 mutations are
                    discovered and we develop a better understanding of which mutations are of greatest influence.
                </Trans>
            </Typography>
        </div>
    );
};

export default TreatmentStep3;
