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

export default () => {
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
            <Typography variant={"body2"}>{t("step3.part2")}</Typography>
            <br />
            <Typography variant={"body2"} className={classes.title}>
                {t("step3.part3")}
                <Link href={"https://www.who.int/pq-vector-control/prequalified-lists/en/"} target={"_blank"}>
                    https://www.who.int/pq-vector-control/prequalified-lists/en/
                </Link>
            </Typography>
            <br />
            <Typography variant={"body2"}>{t("step3.part4")}</Typography>
            <br />
            <Typography variant={"body2"} className={classes.title}>
                {t("step3.part5")}
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
