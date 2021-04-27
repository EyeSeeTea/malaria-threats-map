import React from "react";
import {
    LegendContainer,
    LegendLabels,
    LegendTitleContainer,
    LegendTitleTypography,
    LegendDescriptionText,
} from "../../../Leyend";
import { PboDeploymentColors, PboDeploymentStatus } from "./PboDeploymentSymbols";
import { useTranslation } from "react-i18next";
import { State } from "../../../../store/types";
import { selectLegendExpanded } from "../../../../store/reducers/base-reducer";
import { setLegendExpandedAction } from "../../../../store/actions/base-actions";
import { connect } from "react-redux";
import { Link } from "@material-ui/core";
import styled from "styled-components";

const mapStateToProps = (state: State) => ({
    legendExpanded: selectLegendExpanded(state),
});

const Description = styled.span`
    line-height: 18px;
`;

const mapDispatchToProps = {
    setLegendExpanded: setLegendExpandedAction,
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

function PboDeploymentLegend({ legendExpanded }: Props) {
    const { t } = useTranslation("common");
    const labels = [
        {
            label: !legendExpanded
                ? "prevention.legend.pbo_deployment.eligible"
                : "prevention.legend.pbo_deployment.expanded.eligible",
            color: PboDeploymentColors[PboDeploymentStatus.ELIGIBLE][0],
        },
        {
            label: !legendExpanded
                ? "prevention.legend.pbo_deployment.not_eligible"
                : "prevention.legend.pbo_deployment.expanded.not_eligible",
            color: PboDeploymentColors[PboDeploymentStatus.NOT_ELIGIBLE][0],
        },
        {
            label: !legendExpanded
                ? "prevention.legend.pbo_deployment.not_enough_data"
                : "prevention.legend.pbo_deployment.expanded.not_enough_data",
            color: PboDeploymentColors[PboDeploymentStatus.NOT_ENOUGH_DATA][0],
        },
        {
            label: !legendExpanded
                ? "prevention.legend.pbo_deployment.no_data"
                : "prevention.legend.pbo_deployment.expanded.no_data",
            color: PboDeploymentColors[PboDeploymentStatus.NO_DATA][0],
        },
    ];
    const lng = localStorage.getItem("language");

    const englishLegend = () => (
        <LegendDescriptionText>
            This map shows the status of compliance of local vector populations with the{" "}
            <Link
                href={"https://apps.who.int/iris/bitstream/handle/10665/258939/WHO-HTM-GMP-2017.17-eng.pdf?sequence=5"}
                target={"_blank"}
            >
                three WHO recommended criteria
            </Link>{" "}
            at different geographical sites or areas. The status has been evaluated based on data included in the Global
            database on insecticide resistance in malaria vectors. The map shows the status of compliance for the vector
            species selected on the filter pane. If no species have been filtered, the map considers all data available
            to evaluate the criteria.
        </LegendDescriptionText>
    );

    const spanishLegend = () => (
        <LegendDescriptionText>
            Este mapa muestra el estado de cumplimiento de las poblaciones de vectores locales con los{" "}
            <Link
                href={"https://apps.who.int/iris/bitstream/handle/10665/258939/WHO-HTM-GMP-2017.17-eng.pdf?sequence=5"}
                target={"_blank"}
            >
                tres criterios recomendados por la OMS
            </Link>{" "}
            en diferentes áreas geográficas. El cumplimiento se ha evaluado utilizando los datos incluidos en la base de
            datos mundial sobre la resistencia a los insecticidas en los vectores de la malaria. El mapa muestra el
            estado de cumplimiento para las especies de vectores seleccionadas en el panel de filtros. Si no se ha
            seleccionado ninguna especie, el mapa considera todos los datos disponibles para evaluar los criterios.
        </LegendDescriptionText>
    );

    const frenchLegend = () => (
        <LegendDescriptionText>
            Cette carte montre l&apos;état de conformité des populations locales de vecteurs avec les{" "}
            <Link
                href={"https://apps.who.int/iris/bitstream/handle/10665/258939/WHO-HTM-GMP-2017.17-eng.pdf?sequence=5"}
                target={"_blank"}
            >
                trois critères recommandés par l&apos;OMS
            </Link>{" "}
            dans différents sites ou zones géographiques. Le statut a été évalué sur la base des données incluses dans
            la base de données mondiale sur la résistance aux insecticides des vecteurs du paludisme. La carte montre
            l&apos;état de conformité pour les espèces vectorielles sélectionnées dans le les filtres. Si aucune espèce
            n&apos;est sélectionnée, la carte considère toutes les données disponibles pour évaluer les critères.
        </LegendDescriptionText>
    );
    return (
        <LegendContainer>
            <LegendTitleContainer>
                <LegendTitleTypography color="textPrimary" gutterBottom>
                    {t("prevention.pbo_deployment_legend")}
                </LegendTitleTypography>
            </LegendTitleContainer>
            {legendExpanded && (
                <>
                    <Description>
                        {lng === "en" && englishLegend()}
                        {lng === "fr" && frenchLegend()}
                        {lng === "es" && spanishLegend()}
                    </Description>
                    <br />
                    <br />
                </>
            )}
            <LegendLabels labels={labels} />
        </LegendContainer>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(PboDeploymentLegend);
