import React from "react";
import Typography from "@material-ui/core/Typography";
import { createStyles, makeStyles } from "@material-ui/core";

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
                    La résistance aux médicaments est un défi pour <i>P. vivax</i> et <i>P. falciparum</i>, les deux
                    espèces de parasites du paludisme humain les plus courantes
                </b>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <b>
                    Des informations à jour sur la résistance aux médicaments pour les deux <i>P. vivax</i> et{" "}
                    <i>P. falciparum</i> le paludisme est critique.
                </b>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                Les thérapies combinées à base d&apos;artémisinine (TAC) sont le traitement recommandé pour le parasite
                du paludisme le plus mortel, <i>P. falciparum</i>. Il existe deux mesures de résultats clés pour
                surveiller l&apos;efficacité des TAC: (1) la proportion des échecs de traitement et (2) la proportion de
                patients porteurs de parasites au troisième jour après le début du traitement. Une augmentation de la
                proportion de patients atteints de parasites au jour 3 est un signe d&apos;alerte de la résistance à
                l&apos;artémisinine.
            </Typography>
            <br />
            <Typography variant={"body2"}>
                La chloroquine est encore utilisée dans de nombreux endroits pour traiter <i>P. vivax</i> du paludisme.
                Cependant, comme la résistance à la chloroquine se développe également dans <i>P. vivax</i> parasites,
                certains pays se sont changés pour des TCA pour traiter paludisme à <i>P. vivax.</i>
            </Typography>
        </div>
    );
};
