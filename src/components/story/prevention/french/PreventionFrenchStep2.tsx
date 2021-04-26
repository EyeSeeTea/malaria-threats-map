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

export default function PreventionFrenchStep2() {
    const classes = useStyles({});
    return (
        <div>
            <Typography variant={"h6"} className={classes.title}>
                <b>
                    Les activités de suivi ont révélé que la résistance aux insecticides chez les vecteurs du paludisme
                    était très répandue
                </b>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <b>
                    Sur les 89 pays d’endémie palustre, 65 ont rapporté une résistance aux pyréthrinoïdes chez, au
                    moins, un vecteur local depuis 2010
                </b>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                La résistance a été détectée chez les vecteurs des six régions de l&apos;OMS et aux quatre classes les
                plus couramment utilisés dans la lutte contre les vecteurs adultes. La résistance aux pyréthrinoïdes est
                la plus testée et la plus souvent rapportée.
            </Typography>
            <br />
            <Link
                href="https://www.who.int/malaria/publications/atoz/9789241514057/"
                target="_blank"
                color={"textSecondary"}
            >
                <img src="https://www.who.int/malaria/publications/atoz/9789241514057-eng.jpg" alt="supporting" />
            </Link>
        </div>
    );
}
