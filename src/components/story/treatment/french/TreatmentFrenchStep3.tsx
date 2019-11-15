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
          Les études sur les marqueurs moléculaires fournissent des données
          essentielles pour la détection et le suivi de la résistance aux
          médicaments antipaludiques
        </b>
      </Typography>
      <br />
      <Typography variant={"body2"}>
        <b>
          Les marqueurs moléculaires pour la résistance aux médicaments sont des
          changements génétiques dans le parasite du paludisme qui se sont
          révélés être associés à une résistance.
        </b>
      </Typography>
      <br />
      <Typography variant={"body2"}>
        Par rapport aux études d'efficacité, les études sur les marqueurs
        moléculaires présentent plusieurs avantages pratiques. Par exemple, un
        grand nombre d'échantillons peuvent être collectés et analysés
        rapidement. Les marqueurs moléculaires de la résistance de{" "}
        <i>P. falciparum</i>
        aux médicaments ont été identifiés comprenant la chloroquine, la
        piperaquine, la mefloquine, la pyrimethamine, la sulfadoxine,
        l’atovaquone et l’artémisinine et ses dérivés. Pour les artémisinines,
        plusieurs mutations dans le domaine du promoteur Kelch 13 (K13) se sont
        révélées associées à une clearance parasitaire retardée. Il s'agit d'un
        domaine en constante évolution au fur et à mesure que de nouvelles
        mutations K13 sont découvertes et nous développons une meilleure
        compréhension des mutations ayant la plus grande influence.
      </Typography>
      <br />
      <Typography variant={"body2"}>
        Pour les artémisinines, de nombreuses mutations dans le domaine du
        promoteur Kelch 13 (K13) se sont révélées associées au dégagement de
        parasites retardé. Il s'agit d'un champ évolutif au fur et à mesure que
        de nouvelles mutations K13 sont découvertes et nous développons une
        meilleure compréhension des mutations les plus influentes.
      </Typography>
    </div>
  );
};
