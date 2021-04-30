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
          Los resultados de la vigilancia muestran que la resistencia a los
          insecticidas está muy extendida en los vectores de malaria
        </b>
      </Typography>
      <br />
      <Typography variant={"body2"}>
        <b>
          65 de los 89 países endémicos de malaria han reportado resistencia a
          los piretroides en al menos un vector local desde 2010
        </b>
      </Typography>
      <br />
      <Typography variant={"body2"}>
        A día de hoy, ya ha detectado resistencia a las cuatro clases de
        insecticidas más comúnmente utilizadas en el control de vectores adultos
        de malaria en las seis regiones de la OMS. La resistencia a los
        piretroides es generalmente la más vigilada y la más reportada.
      </Typography>
      <br />
      <Typography variant={"body2"}>
        <Link
          href="https://www.who.int/publications/i/item/9789241514057"
          target="_blank"
          color={"textSecondary"}
        >
          <img
            src="https://www.who.int/malaria/publications/atoz/9789241514057-eng.jpg"
            alt="supporting"
          />
        </Link>
      </Typography>
    </div>
  );
};
