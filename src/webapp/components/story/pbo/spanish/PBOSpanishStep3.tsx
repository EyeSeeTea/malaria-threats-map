import React from "react";
import Typography from "@material-ui/core/Typography";
import { createStyles, makeStyles, Link } from "@material-ui/core";

const useStyles = makeStyles(() =>
    createStyles({
        title: {
            lineHeight: 1.3,
        },
    })
);

export default function PBOSpanishStep3() {
    const classes = useStyles({});
    return (
        <div>
            <Typography variant={"h6"} className={classes.title}>
                <b> Mosquiteros con piretroide y BOP precalificados por la OMS</b>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                El proceso de precalificación de la OMS evalúa los productos de control de vectores por su seguridad,
                calidad y eficacia entomológica según los criterios oficiales de evaluación. Los nuevos tipos de
                mosquiteros actualmente precalificados han demostrado ser seguros y eficaces para el uso previsto.
            </Typography>
            <br />
            <Typography variant={"body2"} className={classes.title}>
                La lista de mosquiteros con piretroide y BOP precalificados por la OMS puede la siguiente página:{" "}
                <Link href={"https://www.who.int/pq-vector-control/prequalified-lists/en/"} target={"_blank"}>
                    https://www.who.int/pq-vector-control/prequalified-lists/en/
                </Link>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                Aún no se conoce la duración del sinergista piperonil butóxido (PBO) impregnado en el material del
                mosquitero.
            </Typography>
            <br />
            <Typography variant={"body2"} className={classes.title}>
                Para obtener más información sobre los mosquiteros con piretroide y BOP, y su diferencia con los
                mosquiteros que solo contienen piretroides, consulte:{" "}
                <Link
                    href={"https://www.who.int/news-room/q-a-detail/new-types-of-insecticide-treated-nets"}
                    target={"_blank"}
                >
                    https://www.who.int/news-room/q-a-detail/new-types-of-insecticide-treated-nets
                </Link>
            </Typography>
        </div>
    );
}
