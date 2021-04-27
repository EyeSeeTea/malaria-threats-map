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

export default function DiagnosisSpanishStep1() {
    const classes = useStyles({});
    return (
        <div>
            <Typography variant={"h6"} className={classes.title}>
                <b>
                    Las supresiones de genes entre los parásitos de la malaria causan falsos negativos en las pruebas de
                    diagnóstico.
                </b>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                Las pruebas de diagnóstico rápido (PDR) se utilizan para el diagnóstico de la malaria en la mayoría de
                las áreas endémicas. La detección de <i>Plasmodium falciparum</i>, el parásito de la malaria que causa
                más mortalidad en el mundo, depende de las PDR dirigidas a la detección de un antígeno llamado HRP2
                (proteína 2 rica en histidina), así como cierta reactividad cruzada con HRP3, una proteína de los
                parásitos estructuralmente similar al HRP2. La gran mayoría de los PDR fabricadas, adquiridas y
                utilizadas en todo el mundo se basan en la detección de HRP2 ya sea solos o en combinación con otros
                antígenos (como la lactato-deshidrogenasa o la aldolasa).
            </Typography>
            <br />
            <Typography variant={"body2"}>
                Sin embargo, en 2010 un estudio patrocinado por la OMS y FIND encontró que algunos parásitos de{" "}
                <i>P. falciparum</i> en el Perú carecían del gen <i>pfhrp2</i>. Sin este gen, el parásito no puede
                producir HRP2 y, por tanto, las pruebas rápidas basadas en HRP2 no lo detectan. Este fue el primer
                informe que confirmó la ausencia del gen <i>pfhrp2</i> entre parásitos de la especie{" "}
                <i>P. falciparum</i> en un entorno clínico.
            </Typography>
            <br />
            <Typography variant={"body2"}>
                See:{" "}
                <Link
                    href="https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0008091"
                    target="_blank"
                    color={"textSecondary"}
                >
                    Gamboa et al. (2010) Una gran proporción de aislamientos de <i>P. falciparum</i> en la región
                    amazónica del Perú carece de <i>pfhrp2</i> y pfhrp3: implicaciones para las pruebas de diagnóstico
                    rápido del paludismo. PLoS One. 5(1):e8091
                </Link>
            </Typography>
        </div>
    );
}
