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
const DiagnosisStep1 = () => {
    const classes = useStyles({});
    const { t } = useTranslation();
    return (
        <div>
            <Typography variant={"h6"} className={classes.title}>
                <Trans i18nKey="diagnosisStory.step1.part1" t={t}>
                    <b> Gene deletions among malaria parasites causes false-negative diagnostic test results </b>
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Trans i18nKey="diagnosisStory.step1.part2" t={t}>
                    Rapid diagnostic tests (RDT) are used for malaria diagnosis in most endemic areas. Detection of{" "}
                    <i> Plasmodium falciparum </i> - the most deadly malaria parasite globally - relies heavily on RDTs
                    that target an antigen called histidine-rich protein 2 (HRP2), as well as some cross-reactivity with
                    HRP3, a structurally similar parasite protein. The vast majority of RDTs manufactured, procured and
                    used around the world are based on detection of HRP2 either alone or in combination with other
                    antigens (such as parasite lactate dehydrogenase or aldolase).
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Trans i18nKey="diagnosisStory.step1.part3" t={t}>
                    However, in 2010 a study sponsored by WHO and FIND found that some
                    <i> P. falciparum </i> parasites in Peru lacked the <i>pfhrp2</i> gene. Without this gene, the
                    parasite cannot produce HRP2 and cannot be detected by HRP2-based RDTs. This was the first report to
                    confirm the absence of the <i>pfhrp2</i> gene among <i>P. falciparum</i> parasites in a clinical
                    setting.
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Trans i18nKey="diagnosisStory.step1.see" t={t}>
                    See:
                </Trans>
                <Link
                    href="https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0008091"
                    target="_blank"
                    color={"textSecondary"}
                >
                    <Trans i18nKey="diagnosisStory.step1.part4" t={t}>
                        Gamboa et al. (2010) A large proportion of <i>P. falciparum</i>
                        isolates in the Amazon region of Peru lack <i>pfhrp2</i> and pfhrp3: implications for malaria
                        rapid diagnostic tests. PLoS One. 5(1):e8091
                    </Trans>
                </Link>
            </Typography>
        </div>
    );
};
export default DiagnosisStep1;
