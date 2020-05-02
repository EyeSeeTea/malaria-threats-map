import React from "react";
import { DialogContent, Link, Typography } from "@material-ui/core";

const FrenchDisclaimer = () => {
  return (
    <DialogContent>
      <Typography variant={"body2"}>
        <strong>Source des données:</strong> Programme mondial contre le
        paludisme.
      </Typography>
      <Typography variant={"body2"}>
        <strong>Production de cartes:</strong> Programme mondial contre le
        paludisme. Organisation mondiale de la santé.{" "}
        <Link
          href={"https://www.who.int/about/copyright/"}
          target="_blank"
          rel="noopener noreferrer"
        >
          {"© WHO 2019"}
        </Link>{" "}
        Tous droits réservés.
      </Typography>
      <br />
      <Typography variant={"body2"}>
        Sauf indication contraire, les informations contenues dans cette demande
        ont été mises à la disposition du Programme mondial de lutte contre le
        paludisme de l'Organisation mondiale de la santé (OMS) par les
        ministères de la Santé ou leurs partenaires de développement; ou par
        leur extraction de publications scientifiques par l'OMS ou ses
        partenaires. L'OMS ne fournit donc aucune assurance quant à la validité,
        l'exactitude ou l'exhaustivité de ces informations.
      </Typography>
      <Typography variant={"body2"}>
        L'utilisation des images et des fichiers générés à partir de cette
        application Web est soumise aux{" "}
        <Link
          href={
            "https://www.who.int/about/who-we-are/publishing-policies/data-policy/terms-and-conditions"
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          Conditions d'utilisation des compilations, agrégations, évaluations et
          analyses de données de l'OMS.
        </Link>
      </Typography>
      <br />
      <Typography variant={"body2"}>
        La citation suivante doit être visiblement placée à côté des images ou
        des fichiers générés à partir de cette application:
      </Typography>
      <Typography variant={"caption"}>
        Source: Carte des menaces du paludisme de l'OMS
        (https://www.who.int/malaria/maps/threats/); date d'accès.
      </Typography>
      <br />
      <br />
      <Typography variant={"body2"}>
        Pour plus d'informations, veuillez contacter:
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

export default FrenchDisclaimer;
