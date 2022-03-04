import React from "react";
import Typography from "@mui/material/Typography";
import { Link } from "@mui/material";
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

const PreventionStep2 = () => {
    const classes = useStyles({});
    const { t } = useTranslation();

    return (
        <div>
            <Typography variant={"h6"} className={classes.title}>
                <Trans i18nKey="preventionStory.step2.part1" t={t}>
                    <b>Monitoring has found that insecticide resistance is widespread in malaria vectors</b>
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Trans i18nKey="preventionStory.step2.part2" t={t}>
                    <b>
                        65 of 89 malaria-endemic countries have reported pyrethroid resistance in at least one local
                        vector since 2010
                    </b>
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Trans i18nKey="preventionStory.step2.part3" t={t}>
                    Resistance has been found in vectors from all six WHO regions and to all four classes of insecticide
                    currently used in adult malaria vector control. Pyrethroid resistance is most commonly tested and
                    reported.
                </Trans>
            </Typography>
            <br />
            <Link href={t("preventionStory.step2.link")} target="_blank" color={"textSecondary"}>
                <img
                    src="https://www.who.int/malaria/publications/atoz/9789241514057-eng.jpg"
                    alt={t("preventionStory.step2.prevention2")}
                />
            </Link>
        </div>
    );
};

export default PreventionStep2;
