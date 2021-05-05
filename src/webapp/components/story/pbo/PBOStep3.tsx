import React from "react";
import Typography from "@material-ui/core/Typography";
import { createStyles, makeStyles, Link } from "@material-ui/core";
import { useTranslation, Trans } from "react-i18next";

const useStyles = makeStyles(() =>
    createStyles({
        title: {
            lineHeight: 1.3,
        },
    })
);

const PBOStep3 = () => {
    const classes = useStyles({});
    const { t } = useTranslation("pbo");

    return (
        <div>
            <Typography variant={"h6"} className={classes.title}>
                <Trans i18nKey="step3.part1" t={t}>
                    <b>Prequalified Pyrethroid-PBO nets</b>
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Trans i18nKey="step3.part2" t={t}>
                    The WHO prequalification process assesses vector control products for their safety, quality and
                    entomological efficacy against published evaluation standards. Currently prequalified new types of
                    ITNs have demonstrated that they are safe and effective for their intended use.
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"} className={classes.title}>
                <Trans i18nKey="step3.part3" t={t}>
                    The list of WHO prequalified pyrethroid-PBO nets can be consulted in the official site:
                </Trans>
                <Link href={"https://www.who.int/pq-vector-control/prequalified-lists/en/"} target={"_blank"}>
                    https://www.who.int/pq-vector-control/prequalified-lists/en/
                </Link>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Trans i18nKey="step3.part4" t={t}>
                    Questions remain on long-term durability of the synergist piperonyl butoxide (PBO) on net fabric.
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"} className={classes.title}>
                <Trans i18nKey="step3.part5" t={t}>
                    For more information about Pyrethroid-PBO nets and their difference with pyrethroid-only nets please
                    consult:
                </Trans>
                <Link
                    href={"https://www.who.int/news-room/q-a-detail/new-types-of-insecticide-treated-nets"}
                    target={"_blank"}
                >
                    https://www.who.int/news-room/q-a-detail/new-types-of-insecticide-treated-nets
                </Link>
            </Typography>
        </div>
    );
};

export default PBOStep3;
