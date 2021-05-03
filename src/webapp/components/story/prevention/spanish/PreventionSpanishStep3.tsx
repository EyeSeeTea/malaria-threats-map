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

export default function PreventionSpanishStep3() {
    const classes = useStyles({});
    return (
        <div>
            <Typography variant={"h6"} className={classes.title}>
                <b>Aún faltan datos recientes y completos sobre la resistencia a los insecticidas en muchos países</b>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <b>
                    47 de 89 países endémicos de malaria reportaron datos para 2017. Los datos de las regiones fuera de
                    África son limitados. La vigilancia a menudo no incluye todas las principales especies de vectores
                    ni todas las clases de insecticidas relevantes.
                </b>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                Se necesitan datos actualizados y representativos para planear e implementar intervenciones de control
                de vectores. La vigilancia de la resistencia a los insecticidas debe realizarse en todos los países
                endémicos de malaria al menos una vez al año, y periódicamente en aquellos países que han eliminado la
                malaria, pero son vulnerables a su reintroducción. Esta vigilancia debe incluir todos los vectores
                principales de las diferentes zonas eco-epidemiológicas. Las pruebas deben realizarse con los
                insecticidas que estén en uso o que se planee usar en el futuro para el control de vectores.
            </Typography>
            <br />
            <Typography variant={"body2"}>
                Los requerimientos para la vigilancia deben definirse mediante un plan nacional de vigilancia y manejo
                de la resistencia a los insecticidas.
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Link
                    href="https://www.who.int/malaria/publications/atoz/9789241512138/es/"
                    target="_blank"
                    color={"textSecondary"}
                >
                    <img
                        src="https://www.who.int/entity/malaria/publications/atoz/9789243512136-es.jpg"
                        alt="supporting"
                    />
                </Link>
            </Typography>
        </div>
    );
}
