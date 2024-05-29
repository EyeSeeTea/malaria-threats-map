import * as React from "react";
import { Divider, Typography } from "@mui/material";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useTranslation } from "react-i18next";
import { PreventionChartDataContent, SelectionData } from "../../../store/SelectionData";
import { preventionBarChartOptions } from "./preventionChartUtils";
import { PreventionMapType } from "../../../store/types";
import { useEffect, useState } from "react";

type Props = {
    mapType: PreventionMapType;
    selectionData: SelectionData;
};

const PreventionChart: React.FC<Props> = ({ mapType, selectionData }) => {
    const { t } = useTranslation();
    const [data, setData] = useState<PreventionChartDataContent>({});

    useEffect(() => {
        if (selectionData.kind === "common" && selectionData.data.kind === "prevention") {
            // There are a bug in highcharts that some times when a filter change and this component render
            // the xaxis labels are mixed. If the component content is unmount and mouunt the work successfully then
            // previously reset data and set data with a timeout to avoid this bug
            setData({});

            const timer = setTimeout(() => {
                setData(selectionData.data.data as PreventionChartDataContent);
            }, 10);

            return () => clearTimeout(timer);
        } else {
            setData({});
        }
    }, [selectionData]);

    return (
        <React.Fragment>
            {Object.keys(data).map((specie, specieIndex) => {
                const dataItems = Object.keys(data[specie]);

                return (
                    <React.Fragment key={specie}>
                        <Typography color="primary" variant="body2" fontWeight="bold">
                            {t(specie)}
                        </Typography>
                        {dataItems.map((type, typeIndex) => {
                            const title = data[specie][type].title;

                            return (
                                <React.Fragment key={`${specie}-${type}`}>
                                    <Typography variant="caption" fontWeight="bold">
                                        {t(type)}
                                    </Typography>
                                    {title && (
                                        <span>
                                            <Typography
                                                variant="caption"
                                                sx={{ color: title.statusColor }}
                                                display="inline"
                                            >
                                                {title.titlePrefix}&nbsp;
                                            </Typography>
                                            <Typography variant="caption" display="inline">
                                                {title.titleContent}&nbsp;
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                sx={{ color: title.statusColor }}
                                                display="inline"
                                            >
                                                {title.titleSufix}
                                            </Typography>
                                        </span>
                                    )}
                                    <div key={type}>
                                        <HighchartsReact
                                            highcharts={Highcharts}
                                            options={preventionBarChartOptions(
                                                mapType,
                                                data[specie][type].seriesData,
                                                specieIndex === 0 && specieIndex === 0
                                            )}
                                        />
                                        {typeIndex < dataItems.length - 1 ? <Divider sx={{ marginBottom: 2 }} /> : null}
                                    </div>
                                </React.Fragment>
                            );
                        })}
                        {specieIndex < Object.keys(data).length - 1 ? (
                            <Divider sx={{ marginBottom: 2, borderBottomWidth: 2 }} />
                        ) : null}
                    </React.Fragment>
                );
            })}
        </React.Fragment>
    );
};

export default PreventionChart;
