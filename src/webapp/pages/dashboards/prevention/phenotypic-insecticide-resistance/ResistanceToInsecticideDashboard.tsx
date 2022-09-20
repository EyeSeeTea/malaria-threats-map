import Highcharts from "highcharts";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import More from "highcharts/highcharts-more";
import PreventionFilterableDashboard from "../PreventionFilterableDashboard";
import { usePreventionFilters } from "../filters/usePreventionFilters";

More(Highcharts);

const ResistanceToInsecticideDashboard: React.FC = () => {
    const { t } = useTranslation();

    const {
        filters,
        onInsecticideClassChange,
        onYearsChange,
        onOnlyIncludeBioassaysWithMoreMosquitoesChange,
        onOnlyIncludeDataByHealthChange,
    } = usePreventionFilters();

    const chartComponentRef = useRef(null);

    return (
        <PreventionFilterableDashboard
            chartComponentRef={null}
            title={t(
                "common.dashboard.phenotypicInsecticideResistanceDashboards.statusOfResistanceToInsecticides.title"
            )}
            filters={filters}
            onInsecticideClassesChange={onInsecticideClassChange}
            onYearsChange={onYearsChange}
            onOnlyIncludeBioassaysWithMoreMosquitoesChange={onOnlyIncludeBioassaysWithMoreMosquitoesChange}
            onOnlyIncludeDataByHealthChange={onOnlyIncludeDataByHealthChange}
        >
            {/* <HighchartsReact highcharts={Highcharts} options={chartOptions(type, series)} ref={chartComponentRef} /> */}
        </PreventionFilterableDashboard>
    );
};

export default React.memo(ResistanceToInsecticideDashboard);

// function chartOptions(type: TreatmentOverTimeType, series: BubleChartGroup[]): Highcharts.Options {
//     return {
//         chart: {
//             type: "bubble",
//             height: "600px",
//             events: {
//                 load() {
//                     setTimeout(this.reflow.bind(this), 0);
//                 },
//             },
//         },

//         legend: {
//             enabled: true,
//             verticalAlign: "top",
//             align: "left",
//             x: 50,
//             margin: 20,
//         },

//         title: {
//             useHTML: true,
//             text: `<div style="display: flex;flex-direction: row;align-items: center;">
//                     ${i18next.t(
//                         "common.dashboard.therapeuticEfficacyDashboards.treatmentFailureOverTime.numberPatients"
//                     )}
//                     <img width="100px" src=${BubbleChartHelpImage} alt='' />
//                    </div>`,
//             align: "right",
//             x: -30,
//             y: 40,
//             margin: 20,
//             style: {
//                 fontSize: "14px",
//                 fontWeight: "bold",
//             },
//         },

//         xAxis: {
//             gridLineWidth: 1,
//             title: {
//                 text: i18next.t("common.dashboard.therapeuticEfficacyDashboards.treatmentFailureOverTime.year"),
//                 margin: 20,
//                 style: {
//                     fontSize: "14px",
//                     fontWeight: "bold",
//                 },
//             },
//             tickInterval: 2,
//         },

//         yAxis: {
//             startOnTick: false,
//             endOnTick: false,
//             title: {
//                 text:
//                     type === "treatmentFailure"
//                         ? i18next.t(
//                               "common.dashboard.therapeuticEfficacyDashboards.treatmentFailureOverTime.treatmentFailure"
//                           )
//                         : i18next.t(
//                               "common.dashboard.therapeuticEfficacyDashboards.parasiteClearanceOverTime.parasitemiaOnDay3"
//                           ),
//                 margin: 40,
//                 style: {
//                     fontSize: "14px",
//                     fontWeight: "bold",
//                 },
//             },
//             maxPadding: 0.2,
//             plotLines:
//                 type === "treatmentFailure"
//                     ? [
//                           {
//                               color: "#d43616",
//                               dashStyle: "Solid",
//                               width: 3,
//                               value: 10,
//                               zIndex: 3,
//                           },
//                       ]
//                     : [],
//             min: 0,
//         },
//         tooltip: {
//             enabled: true,
//             pointFormat: "Patients {point.z}",
//         },
//         series,
//         credits: {
//             enabled: false,
//         },
//     };
// }
