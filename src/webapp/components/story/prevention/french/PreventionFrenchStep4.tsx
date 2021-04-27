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

export default function PreventionFrenchStep4() {
    const classes = useStyles({});
    return (
        <div>
            <Typography variant={"h6"} className={classes.title}>
                <b>L’augmentation de la résistance souligne le besoin urgent d’un meilleur suivi</b>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <b>
                    Les vecteurs du paludisme dans certaines régions d&apos;Afrique peuvent désormais survivre à une
                    exposition à de fortes concentrations d&apos;insecticides, ce qui indique une résistance
                    intensifiée.
                </b>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                Les tests classiques de résistance mesurent le nombre de moustiques qui survivent à l&apos;exposition à
                une concentration standard d&apos;insecticide. Cependant, l&apos;intensité de la résistance chez les
                survivants et les mécanismes qui confèrent la résistance sont importants. Un niveau élevé de résistance
                impose une action urgente qui devrait être guidée par la connaissance des mécanismes impliqués dans la
                résistance.
            </Typography>
            <br />
            <Typography variant={"body2"}>
                Les procédures de tests de sensibilité de l&apos;OMS ont récemment été élargies pour inclure des
                bio-essais qui mesurent l&apos;intensité de la résistance et l&apos;implication des mécanismes
                métaboliques.
            </Typography>
            <br />
            <Link
                href="https://www.who.int/malaria/publications/atoz/9789241511575/fr/"
                target="_blank"
                color={"textSecondary"}
            >
                <img
                    src="https://www.who.int/entity/malaria/publications/atoz/9789241511575_eng.JPG"
                    alt="supporting"
                />
            </Link>
        </div>
    );
}
