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

const PreventionStep2 = () => {
    const classes = useStyles({});
    const { t } = useTranslation("prevention");

    return (
        <div>
            <Typography variant={"h6"} className={classes.title}>
                <Trans i18nKey="step2.part1" t={t}>
                    <b>Monitoring has found that insecticide resistance is widespread in malaria vectors</b>
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Trans i18nKey="step2.part2" t={t}>
                    <b>
                        65 of 89 malaria-endemic countries have reported pyrethroid resistance in at least one local
                        vector since 2010
                    </b>
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>{t("step2.part3")}</Typography>
            <br />
            <Link href={t("step2.link")} target="_blank" color={"textSecondary"}>
                <img
                    src="https://www.who.int/malaria/publications/atoz/9789241514057-eng.jpg"
                    alt={t("step2.prevention2")}
                />
            </Link>
        </div>
    );
};

export default PreventionStep2;