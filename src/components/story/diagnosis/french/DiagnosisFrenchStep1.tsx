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
                    Les délétions de gènes parmi les parasites du paludisme provoquent des résultats de tests de
                    diagnostic faussement négatifs
                </b>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                Les tests de diagnostic rapide (TDR) sont utilisés pour le diagnostic du paludisme dans la plupart des
                zones endémiques. La détection de <i>Plasmodium falciparum</i> - le parasite du paludisme le plus mortel
                à l&apos;échelle mondiale - repose sur les TDR qui ciblent un antigène appelé protéine riche en
                histidine 2 (HRP2), ainsi qu&apos;une certaine réactivité croisée avec HRP3, une protéine de parasite
                structurellement similaire. La grande majorité des TDR fabriqués, achetés et utilisés dans le monde sont
                basés sur la détection de HRP2, soit seul, soit en association avec d&apos;autres antigènes (tels que le
                lactate déshydrogénase parasite ou l&apos;aldolase)
            </Typography>
            <br />
            <Typography variant={"body2"}>
                Cependant, en 2010, une étude parrainée par l&apos;OMS et FIND a révélé que certains parasites de{" "}
                <i>P. falciparum</i> au Pérou manquaient du gène <i>pfhrp2</i>. Sans ce gène, le parasite ne peut pas
                produire de HRP2 et ne peut pas être détecté par des TDR à base de HRP2. Ce fut le premier rapport à
                confirmer l&apos;absence du gène <i>pfhrp2</i> chez les parasites de <i>P. falciparum</i> dans un
                contexte clinique.
            </Typography>
            <br />
            <Typography variant={"body2"}>
                See:{" "}
                <Link
                    href="https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0008091"
                    target="_blank"
                    color={"textSecondary"}
                >
                    Gamboa et al. (2010) A large proportion of <i>P. falciparum</i> isolates in the Amazon region of
                    Peru lack <i>pfhrp2</i> and pfhrp3: implications for malaria rapid diagnostic tests. PLoS One.
                    5(1):e8091
                </Link>
            </Typography>
        </div>
    );
};
