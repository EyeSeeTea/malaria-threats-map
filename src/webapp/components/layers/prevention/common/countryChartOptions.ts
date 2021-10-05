export interface StatusCountryChartLabels {
    title: string;
    numberOfTests: string;
    chartStudies: string;
}

const statusCountryChartOptions: (data: any, labels: StatusCountryChartLabels) => Highcharts.Options = (
    data,
    labels
) => ({
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: "pie",
        height: 250,
        style: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif;',
        },
    },
    title: {
        text: `<b>${labels.title}</b> (${labels.numberOfTests})`,
    },
    tooltip: {
        pointFormat: "{series.name}: <b>{point.y}</b>",
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: "pointer",
            dataLabels: {
                enabled: true,
                format: "<b>{point.name}</b>: {point.y}",
            },
        },
    },
    series: [
        {
            type: "pie",
            innerSize: "50%",
            name: labels.chartStudies,
            colorByPoint: true,
            data,
        },
    ],
    legend: {
        enabled: true,
    },
    credits: {
        enabled: false,
    },
});

export default statusCountryChartOptions;
