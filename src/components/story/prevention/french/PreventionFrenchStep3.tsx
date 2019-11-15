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
          Nombreux sont les pays à ne pas disposer de données récentes et
          complètes sur la résistance aux insecticides
        </b>
      </Typography>
      <br />
      <Typography variant={"body2"}>
        <b>
          Sur les 89 pays d’endémie palustre, 47 ont rapporté des données pour
          2017. Les données sont, à quelques exceptions près, assez rares en
          dehors de l’Afrique. Le suivi ne comprend pas toujours tous les
          principaux vecteurs, ni toutes les principales classes d'insecticides.
        </b>
      </Typography>
      <br />
      <Typography variant={"body2"}>
        Des données à jour et représentatives sont nécessaires pour la
        planification et la mise en œuvre de la lutte antivectorielle. Le suivi
        de la résistance devrait être effectué dans tous les pays d’endémie
        palustre au moins une fois par an, et périodiquement dans les pays ayant
        éliminé le paludisme mais qui restent vulnérable à la réintroduction. Le
        suivi de la résistance devrait inclure tous les principaux vecteurs
        provenant des différentes zones éco-épidémiologiques. Les tests de
        sensibilité devraient être effectués avec des classes d'insecticides qui
        sont soit utilisées, soit prévues pour être utilisées dans la lutte
        antivectorielle.
      </Typography>
      <br />
      <Typography variant={"body2"}>
        Les exigences de suivi de la résistance doivent être définies dans le
        cadre d'un plan national de suivi et de gestion de la résistance aux
        insecticides.
      </Typography>
      <br />
      <Link
        href="https://www.who.int/malaria/publications/atoz/9789241512138/fr/"
        target="_blank"
        color={"textSecondary"}
      >
        <img
          src="https://www.who.int/entity/malaria/publications/atoz/9789242512137-fr.jpg"
          alt="supporting"
        />
      </Link>
    </div>
  );
};
