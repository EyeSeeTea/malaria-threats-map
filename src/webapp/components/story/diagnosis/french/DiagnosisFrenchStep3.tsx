import React from "react";
import Typography from "@material-ui/core/Typography";
import { createStyles, makeStyles } from "@material-ui/core";

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
          Une surveillance accrue des délétions de gènes <i>pfhrp2/3</i> parmi
          le <i>P. falciparum</i> est essentielle
        </b>
      </Typography>
      <br />
      <Typography variant={"body2"}>
        Une fois que les délétions <i>pfhrp2/3</i> sont confirmées dans une
        région géographique, des enquêtes devraient être menées localement et
        dans les zones voisines pour estimer la prévalence des parasites portant
        des délétions des gènes. Dans les contextes cliniques, la (les) cause
        (s) des TDR faussement négatifs devraient faire l'objet d'une enquête.
      </Typography>
      <br />
      <Typography variant={"body2"}>
        La surveillance sentinelle devrait être instituée avec tous les
        résultats (positifs et négatifs) signalés. Les données doivent être bien
        gérées pour aider à hiérarchiser les enquêtes, suivre adéquatement les
        tendances dans le temps et informer une réponse coordonnée.
      </Typography>
      <br />
      <Typography variant={"body2"}>
        Depuis 2017, la base de données de l'OMS comprend les données de
        délétion des gènes <i>pfhrp2/3</i> pour 29 pays dans 5 régions de l'OMS.
      </Typography>
    </div>
  );
};
