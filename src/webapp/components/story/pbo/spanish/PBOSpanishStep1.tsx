import React from "react";
import Typography from "@material-ui/core/Typography";
import { createStyles, Link, makeStyles } from "@material-ui/core";
import image1 from "../../../../assets/img/pbo_page_1_1.png";
import image2 from "../../../../assets/img/pbo_page_1_2.png";
import styled from "styled-components";

const useStyles = makeStyles(() =>
    createStyles({
        title: {
            lineHeight: 1.3,
        },
    })
);

const Images = styled.div`
    display: flex;
    justify-content: space-between;
`;

export default function PBOSpanishStep1() {
    const classes = useStyles({});
    return (
        <div>
            <Typography variant={"body1"} className={classes.title}>
                <b>¿Qué son los mosquiteros con piretroide y BOP? </b>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                Los mosquiteros con piretroide y BOP son mosquiteros que incluyen tanto un insecticida piretroide como
                el sinergista BOP. El BOP actúa inhibiendo ciertas enzimas metabólicas dentro del mosquito (por ejemplo,
                oxidasas de función mixta) que desintoxican o secuestran los insecticidas antes de que puedan tener un
                efecto tóxico en el mosquito.
            </Typography>
            <br />
            <Typography variant={"body1"} className={classes.title}>
                <b>¿Los recomienda la OMS como intervención de salud pública?</b>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                La OMS recomienda condicionalmente el despliegue de los mosquiteros con piretroides-BOP precalificados
                por la OMS, en lugar de los mosquiteros que solo contienen piretroide, en aquellos lugares donde los
                vectores principales del paludismo presentan resistencia a los piretroides que sea: a) confirmada; b) de
                nivel intermedio, y c) conferida, al menos en parte, por un mecanismo de resistencia basado en la
                monoxigenasa, determinado mediante procedimientos estándar.
            </Typography>
            <br />
            <Typography variant={"body2"}>
                Esta recomendación se otorgó excepcionalmente en 2017 con base a los datos epidemiológicos de un ensayo
                clínico randomizado en clusters y seguirá siendo condicional hasta que los datos de al menos otro
                ensayo, realizado durante un periodo de 2 años, confirmen el impacto epidemiológico demostrado por el
                primer ensayo.
            </Typography>
            <br />
            <Images>
                <Link
                    href="https://apps.who.int/iris/bitstream/handle/10665/310862/9789241550499-eng.pdf?ua=1"
                    target="_blank"
                    color={"textSecondary"}
                >
                    <img src={image1} alt="pbo 1" width={150} />
                </Link>
                <Link
                    href="https://apps.who.int/iris/bitstream/handle/10665/258939/WHO-HTM-GMP-2017.17-eng.pdf?sequence=5"
                    target="_blank"
                    color={"textSecondary"}
                >
                    <img src={image2} alt="pbo 2" width={150} />
                </Link>
            </Images>
        </div>
    );
}
