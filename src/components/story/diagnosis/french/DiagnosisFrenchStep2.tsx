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
                    Les délétions de <i>pfhrp2/3gènes</i> peuvent avoir d&apos;importantes implications pour la santé
                    publique
                </b>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                Les faux résultats de TDR négatifs dus aux suppressions de <i>pfhrp2/3</i> peuvent entraîner un
                diagnostic incorrect ou retardé et menacer la sécurité du patient. Le patient peut également continuer à
                être une source de transmission du paludisme jusqu&apos;à ce qu&apos;il soit correctement traité.
            </Typography>
            <br />
            <Typography variant={"body2"}>
                Depuis 2010, les enquêtes dans plusieurs contextes en Afrique et en Asie ont également trouvé une
                proportion variable de <i>P. falciparum</i> parasites dépourvus du gène <i>pfhrp2</i>. La prévalence de
                cette mutation génétique varie à l’intérieur des pays et entre les pays. Si elle est confirmée, les
                achats des TDR et les pratiques de gestion des cas doivent être adaptés en conséquence. L&apos;OMS
                recommande de changer pour un TDR qui ne repose pas exclusivement sur le HRP2 pour détection de{" "}
                <i>P. falciparum</i> (c.-à-d. pf-pLDH) si la prévalence des TDR faussement négatifs en raison de la
                délétion <i>pfhrp2</i> est ≥ 5% parmi les patients symptomatiques.
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Link
                    href="https://www.who.int/malaria/publications/atoz/information-note-hrp2-based-rdt/"
                    target="_blank"
                    color={"textSecondary"}
                >
                    Link to supporting studies.
                </Link>
            </Typography>
        </div>
    );
};
