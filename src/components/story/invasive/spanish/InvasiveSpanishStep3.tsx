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
                    Las estrategias de control vectorial deben diseñarse basándose en las mejores prácticas
                    implementados por otros países, deben monitorearse y evaluarse adecuadamente y modificarse cuando
                    sea necesario.
                </b>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <b>
                    Las especies de vectores invasoras pueden adaptarse a su nuevo entorno cambiando sus comportamientos
                    tradicionales y/o volviéndose resistentes a los insecticidas cuando son expuestas a intervenciones
                    de control vectorial.
                </b>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                Debido a estos potenciales cambios, los programas nacionales deben monitorear y evaluar continuamente la
                efectividad de las intervenciones de control vectorial desplegadas y modificarlas estratégicamente
                cuando sea necesario.
            </Typography>
            <br />
            <Typography variant={"body2"}>
                La OMS recomienda a los programas nacionales, y sus socios implementadores, documentar las lecciones
                aprendidas y comunicarlas a la OMS a través del e-mail{" "}
                <Link href="mailto:vectorsurveillance@who.int" color={"textSecondary"}>
                    vectorsurveillance@who.int
                </Link>
                . Esto es crucial para construir la evidencia científica necesaria para formular estrategias para el
                control y eliminación de las especies de vectores invasora.
            </Typography>
        </div>
    );
};
