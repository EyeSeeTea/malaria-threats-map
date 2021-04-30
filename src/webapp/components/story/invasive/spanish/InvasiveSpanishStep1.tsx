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
          La detección de <i>An. stephensi</i> en Sri Lanka y el cuerno de
          África resalta la capacidad de las especies de vectores de extenderse
          a nuevas áreas geográficas.
        </b>
      </Typography>
      <br />
      <Typography variant={"body2"}>
        <b>
          Otro ejemplo lo proporciona la introducción de <i>An. gambiae</i> en
          el norte de Brasil en 1930. Su eliminación demuestra que las
          invasiones de vectores pueden controlarse.
        </b>
      </Typography>
      <br />
      <Typography variant={"body2"}>
        <i>An. stephensi</i> es un vector de malaria urbana altamente eficiente.
        Aunque es tradicionalmente nativo de ciertos países del sudeste asiático
        y la Península Arábiga, desde 2012 ha sido detectado en Djibouti (2012),
        Etiopía (2016), Sri Lanka (2017) y más recientemente en la República del
        Sudán (2019, datos no publicados).
      </Typography>
      <br />
      <Typography variant={"body2"}>
        La propagación de <i>An. Stephensi</i> ha contribuido al resurgimiento
        de la malaria en la ciudad de Djibouti. En Sri Lanka, podría poner en
        peligro los esfuerzos de prevención del restablecimiento de la malaria.
        En África, dado la rápida y descontrolada urbanización, la propagación
        de <i>An. stephensi</i> en el medio urbano podría poner en riesgo los
        logros en la reducción de la carga de malaria conseguidos desde el año
        2000.
      </Typography>
      <br />
      <Typography variant={"body2"}>
        <Link
          href="https://www.who.int/publications/i/item/vector-alert-anopheles-stephensi-invasion-and-spread"
          target="_blank"
          color={"textSecondary"}
        >
          <img
            src="https://apps.who.int/iris/rest/bitstreams/1283866/retrieve"
            alt="supporting"
          />
        </Link>
      </Typography>
    </div>
  );
};
