import React from "react";
import { DialogContent, Link, Typography } from "@material-ui/core";

const SpanishDisclaimer = () => {
  return (
    <DialogContent>
      <Typography variant={"body2"}>
        <strong>Fuente de datos:</strong> Programa Mundial sobre el Paludismo
      </Typography>
      <Typography variant={"body2"}>
        <strong>Elaboración de mapas:</strong> Programa Mundial sobre el
        Paludismo. Organización Mundial de la Salud.{" "}
        <Link
          href={"https://www.who.int/about/copyright/"}
          target="_blank"
          rel="noopener noreferrer"
        >
          {"© WHO 2019"}
        </Link>{" "}
        Todos los privilegios reservados.
      </Typography>
      <br />
      <Typography variant={"body2"}>
        A menos que se especifique lo contrario, la información contenida en
        esta aplicación Web ha sido puesta a disposición del Programa Mundial
        sobre Paludismo de la Organización Mundial de la Salud (OMS) por los
        Ministerios de Salud o sus asociados en el desarrollo, o mediante su
        extracción de publicaciones científicas por parte de la OMS o sus
        socios. Por consiguiente, la OMS no garantiza la validez, exactitud o
        integridad de esta información.
      </Typography>
      <Typography variant={"body2"}>
        El uso de imágenes y archivos generados a partir de esta aplicación está
        sujeto a los{" "}
        <Link
          href={
            "https://www.who.int/about/who-we-are/publishing-policies/data-policy/terms-and-conditions"
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          Términos y condiciones de uso para compilaciones, agregaciones,
          evaluaciones y análisis de datos de la OMS.
        </Link>
      </Typography>
      <br />
      <Typography variant={"body2"}>
        La siguiente cita deberá proporcionarse visiblemente junto con las
        imágenes o archivos generados desde la aplicación.
      </Typography>
      <Typography variant={"caption"}>
        Fuente: Mapa de los desafíos de la malaria:
        (https://www.who.int/malaria/maps/threats/); fecha de acceso
      </Typography>
      <br />
      <br />
      <Typography variant={"body2"}>
        Para obtener más información, póngase en contacto con:{" "}
        <Link
          href={"mailto:gmp-maps@who.int"}
          target="_blank"
          rel="noopener noreferrer"
        >
          gmp-maps@who.int
        </Link>
      </Typography>
    </DialogContent>
  );
};

export default SpanishDisclaimer;
