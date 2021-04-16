import React from "react";
import Typography from "@material-ui/core/Typography";
import { createStyles, Link, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() =>
    createStyles({
        title: {
            lineHeight: 1.3,
        },
    })
);

export default () => {
    const classes = useStyles({});
    return (
        <div>
            <Typography variant={"h6"} className={classes.title}>
                <b>
                    La détection opportune des espèces vectrices invasives est cruciale pour contenir leur propagation.
                </b>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <b>
                    Les systèmes de surveillance entomologique fournissent des informations essentielles pour la
                    conception et la mise en œuvre des stratégies de lutte antivectorielle.
                </b>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                La connaissance des gîtes de reproduction et de repos des espèces vectrices, de leur comportement, de
                leurs préférences alimentaires et de leur statut en matière de résistance est nécessaire pour concevoir
                des interventions efficaces visant à prévenir la propagation des espèces vectrices invasives et leur
                établissement dans de nouvelles aires géographiques.
            </Typography>
            <br />
            <Typography variant={"body2"}>
                L&apos;OMS recommande que tous les pays d&apos;endémie palustre effectuent une surveillance
                entomologique et signalent à l&apos;OMS la détection d&apos;espèces soupçonnées d&apos;être invasives en
                remplissant et en envoyant le formulaire de l&apos;OMS pour signaler la détection des espèces
                d’anophèles vectrices invasives
                <Link
                    target="_blank"
                    href="https://www.who.int/docs/default-source/documents/publications/gmp/whogmp-invasive-species-reporting-formd9410d7f2b424a04949a64b5e5f5fbd9.xlsm"
                    color={"textSecondary"}
                >
                    Formulaire de l&apos;OMS pour signaler la détection d&apos;espèces d’anophèles vectrices invasives
                </Link>{" "}
                à{" "}
                <Link href="mailto:vectorsurveillance@who.int" color={"textSecondary"}>
                    vectorsurveillance@who.int
                </Link>
                .
            </Typography>
            <br />
            <Typography variant={"body2"}>
                Les indicateurs clés pour la surveillance entomologique sont énumérés au chapitre 5 du manuel de
                référence de l&apos;OMS intitulé:
                <Link
                    target="_blank"
                    href="https://www.who.int/malaria/publications/atoz/9789241565578/fr/"
                    color={"textSecondary"}
                >
                    Lutte contre le paludisme : surveillance, suivi et évaluation. Un manuel de référence
                </Link>
                .
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Link
                    href="https://www.who.int/malaria/publications/atoz/9789241565578/fr/"
                    target="_blank"
                    color={"textSecondary"}
                >
                    <img
                        src="https://www.who.int/malaria/publications/atoz/9789241565578-cover-fr.jpg"
                        alt="supporting"
                    />
                </Link>
            </Typography>
        </div>
    );
};
