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
          Las supresiones de los genes <i>pfhrp2/3</i> pueden tener
          implicaciones significativas para la salud pública
        </b>
      </Typography>
      <br />
      <Typography variant={"body2"}>
        Los falsos negativos obtenidos mediante PDR causados por supresiones de{" "}
        <i>pfhrp2/3</i> pueden conducir a un diagnóstico incorrecto o tardío y
        amenazar la seguridad del paciente. Además, el paciente puede seguir
        siendo una fuente de transmisión de la malaria hasta que se le trate
        adecuadamente.
      </Typography>
      <br />
      <Typography variant={"body2"}>
        Desde 2010, varios estudios realizados en distintas regiones de África y
        Asia también encontraron parásitos <i>P. falciparum</i> que carecen del
        gen <i>pfhrp2</i>. La prevalencia de esta mutación genética varía según
        los países. En los lugares donde se confirma la supresión del gen, las
        prácticas de compra de PDR y gestión de casos deben adaptarse en
        consecuencia. En los casos en los que la prevalencia de falsos negativos
        debido a la supresión del <i>pfhrp2</i> supera el 5% la OMS recomienda
        usar una PDR que no esté basada exclusivamente en la detección de HRP2
        para detectar parásitos de la especie <i>P. falciparum</i> (pf-pLDH) en
        pacientes sintomáticos.
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
