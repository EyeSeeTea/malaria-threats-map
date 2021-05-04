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

const PreventionStep1 = () => {
    const classes = useStyles({});
    const { t } = useTranslation("prevention");

    return (
        <div>
            <Typography variant={"h6"} className={classes.title}>
                <Trans i18nKey="step1.part1" t={t}>
                    <b>Monitoring insecticide resistance in malaria vectors is essential</b>
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Trans i18nKey="step1.part2" t={t}>
                    <b>
                        80 of 89 malaria-endemic countries reported monitoring for insecticide resistance between 2010
                        and 2017. The extent and quality of data varies between countries.
                    </b>
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Trans i18nKey="step1.part3" t={t}>
                    Malaria prevention is heavily reliant on core tools that target malaria mosquitoes: long-lasting
                    insecticidal nets and indoor residual insecticide sprays. Resistance of mosquitoes to insecticides
                    is a major concern particularly for pyrethroids as these are the only insecticide class currently
                    approved for use on nets.
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Trans i18nKey="step1.part4" t={t}>
                    The WHO Global Plan for Insecticide Resistance Management in malaria vectors (GPIRM) is a call to
                    action to maintain the effectiveness of malaria vector control. Resistance monitoring is needed to
                    inform resistance mitigation and management strategies.
                </Trans>
            </Typography>
            <br />

            <Link href={t("step1.link")} target="_blank" color={"textSecondary"}>
                <img
                    src="https://www.who.int/entity/malaria/publications/atoz/9789241564472_cover.jpg"
                    alt={t("step1.prevention1")}
                />
            </Link>
        </div>
    );
};

export default PreventionStep1;