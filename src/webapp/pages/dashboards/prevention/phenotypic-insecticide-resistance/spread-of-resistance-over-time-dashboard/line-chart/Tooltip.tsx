import React from "react";
import i18next from "i18next";
import { SpreadOfResistanceOverTimeChartType } from "../../types";

export interface CustomPoint extends Highcharts.Point {
    insecticideClassOrType: string;
    year: string;
    rangeYears: string;
    sumOfConfirmedResistanceSites: number;
    sumOfSites: number;
    numberOfSites: number;
    numberOfSitesConfirmedResistance: number;
}

const Tooltip: React.FC<{
    chartType: SpreadOfResistanceOverTimeChartType;
    point: CustomPoint;
}> = ({ point, chartType }) => {
    return (
        <div style={{ padding: "16px" }}>
            <div>
                <h4>
                    {chartType === "by-insecticide-class"
                        ? i18next.t("common.dashboard.tooltip.insecticideClass")
                        : i18next.t("common.dashboard.tooltip.insecticideType")}
                    : {i18next.t(point.insecticideClassOrType)}
                </h4>
            </div>

            <div>
                <div
                    style={{
                        borderBottom: "1px solid #d0d0d0",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingBottom: "10px",
                    }}
                >
                    <span>{i18next.t("common.dashboard.tooltip.year")}: </span>
                    <span style={{ paddingLeft: "10px" }}>{point.year}</span>
                </div>

                <div
                    style={{
                        borderBottom: "1px solid #d0d0d0",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingBottom: "10px",
                        paddingTop: "10px",
                    }}
                >
                    <span>
                        {i18next.t("common.dashboard.tooltip.numberOfSitesConfirmedResistance")} ({point.year}):{" "}
                    </span>
                    <span style={{ paddingLeft: "10px" }}>{point.numberOfSitesConfirmedResistance}</span>
                </div>

                <div
                    style={{
                        borderBottom: "1px solid #d0d0d0",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingBottom: "10px",
                        paddingTop: "10px",
                    }}
                >
                    <span>
                        {i18next.t("common.dashboard.tooltip.numberOfSites")} ({point.year}):{" "}
                    </span>
                    <span style={{ paddingLeft: "10px" }}>{point.numberOfSites}</span>
                </div>

                <div
                    style={{
                        borderBottom: "1px solid #d0d0d0",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingBottom: "10px",
                        paddingTop: "10px",
                    }}
                >
                    <span>
                        {i18next.t("common.dashboard.tooltip.numberOfSitesConfirmedResistance")} ({point.rangeYears}):{" "}
                    </span>
                    <span style={{ paddingLeft: "10px" }}>{point.sumOfConfirmedResistanceSites}</span>
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingBottom: "10px",
                        paddingTop: "10px",
                    }}
                >
                    <span>
                        {i18next.t("common.dashboard.tooltip.numberOfSites")} ({point.rangeYears}):{" "}
                    </span>
                    <span style={{ paddingLeft: "10px" }}>{point.sumOfSites}</span>
                </div>
            </div>
        </div>
    );
};

export default Tooltip;
