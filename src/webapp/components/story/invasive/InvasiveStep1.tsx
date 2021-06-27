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
const InvasiveStep1 = () => {
    const classes = useStyles({});
    const { t } = useTranslation();
    return (
        <div>
            <Typography variant={"h6"} className={classes.title}>
                <Trans i18nKey="invasiveStory.step1.part1" t={t}>
                    <b>
                        The recent detection of <i>An. stephensi</i> in Sri Lanka and the horn of Africa underscores the
                        potential for vector species to spread and establish in new geographical areas.
                    </b>
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Trans i18nKey="invasiveStory.step1.part2" t={t}>
                    <b>
                        <i>An. Gambiae</i> ’s invasion of northern Brazil in 1930 provides another example. Its
                        elimination between 1930s and early 40s proves that vector invasions can be controlled.
                    </b>
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Trans i18nKey="invasiveStory.step1.part3" t={t}>
                    <i>An. stephensi</i> is a highly efficient urban malaria vector traditionally reported from certain
                    countries in South-East Asia and the Arabian Peninsula. Since 2012, it has been detected in Djibouti
                    (2012), Ethiopia (2016), Sri Lanka (2017) and most recently in the Republic of the Sudan (2019,
                    unpublished report).
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Trans i18nKey="invasiveStory.step1.part4" t={t}>
                    The invasion of <i>An. stephensi</i> has contributed to the resurgence of malaria in Djibouti City.
                    In Sri Lanka, the recent invasion of this vector could jeopardize efforts to prevent the
                    re-establishment of malaria. In Africa, given the rapid and uncontrolled growth of cities, further
                    spread and establishment of <i>An. stephensi</i> in urban environments could put at risk the gains
                    in malaria burden reduction made since 2000.
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Link href="https://apps.who.int/iris/handle/10665/326595" target="_blank" color={"textSecondary"}>
                    <img
                        src="https://apps.who.int/iris/rest/bitstreams/1283866/retrieve"
                        alt={t("invasiveStory.step1.supporting")}
                    />
                </Link>
            </Typography>
        </div>
    );
};

export default InvasiveStep1;
