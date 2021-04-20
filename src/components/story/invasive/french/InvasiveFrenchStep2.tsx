import React from "react";
import Typography from "@material-ui/core/Typography";
import { createStyles, Link, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() =>
  createStyles({
    title: {
      lineHeight: 1.3
    }
  })
);

export default () => {
  const classes = useStyles({});
  return (
    <div>
      <Typography variant={"h6"} className={classes.title}>
        <b>
          La détection opportune des espèces vectrices invasives est cruciale
          pour contenir leur propagation.
        </b>
      </Typography>
      <br />
      <Typography variant={"body2"}>
        <b>
          Les systèmes de surveillance entomologique fournissent des
          informations essentielles pour la conception et la mise en œuvre des
          stratégies de lutte antivectorielle.
        </b>
      </Typography>
      <br />
      <Typography variant={"body2"}>
        La connaissance des gîtes de reproduction et de repos des espèces
        vectrices, de leur comportement, de leurs préférences alimentaires et de
        leur statut en matière de résistance est nécessaire pour concevoir des
        interventions efficaces visant à prévenir la propagation des espèces
        vectrices invasives et leur établissement dans de nouvelles aires
        géographiques.
      </Typography>
      <br />
      <Typography variant={"body2"}>
        L'OMS recommande que tous les pays d'endémie palustre effectuent une
        surveillance entomologique et signalent à l'OMS la détection d'espèces
        soupçonnées d'être invasives en remplissant et en envoyant le formulaire
        de l'OMS pour signaler la détection des espèces d’anophèles vectrices
        invasives
        <Link
          target="_blank"
          href="https://www.who.int/publications/i/item/who-form-to-report-detection-of-invasive-anopheles-vector-species"
          color={"textSecondary"}
        >
          Formulaire de l'OMS pour signaler la détection d'espèces d’anophèles
          vectrices invasives
        </Link>{" "}
        à{" "}
        <Link href="mailto:vectorsurveillance@who.int" color={"textSecondary"}>
          vectorsurveillance@who.int
        </Link>
        .
      </Typography>
      <br />
      <Typography variant={"body2"}>
        Les indicateurs clés pour la surveillance entomologique sont énumérés au
        chapitre 5 du manuel de référence de l'OMS intitulé:
        <Link
          target="_blank"
          href="https://www.who.int/malaria/publications/atoz/9789241565578/fr/"
          color={"textSecondary"}
        >
          Lutte contre le paludisme : surveillance, suivi et évaluation. Un
          manuel de référence
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
