import * as React from "react";
import { Divider, Typography } from "@mui/material";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useTranslation } from "react-i18next";
import { SelectionData } from "../../../store/types";
import { chartOptions, getTranslations } from "./utils";

type Props = {
    selectionData: SelectionData;
};

const PreventionChart: React.FC<Props> = ({ selectionData }) => {
    const { t } = useTranslation();

    const data = React.useMemo(() => {
        if (selectionData.data.kind === "prevention") {
            return selectionData.data.data;
        } else {
            return null;
        }
    }, [selectionData]);

    return (
        <React.Fragment>
            {data &&
                Object.keys(selectionData.data).map(specie => {
                    const dataItems = Object.keys(data[specie]);

                    return (
                        <React.Fragment key={specie}>
                            <Typography color="primary" variant="body2" fontWeight="bold">
                                {t(specie)}
                            </Typography>
                            <Typography variant="caption">{t(selectionData.studyObject.TYPE)}</Typography>
                            {dataItems.map((insecticideType, index) => {
                                return (
                                    <div key={insecticideType}>
                                        <HighchartsReact
                                            highcharts={Highcharts}
                                            options={chartOptions(
                                                data[specie][insecticideType],
                                                getTranslations(insecticideType)
                                            )}
                                        />
                                        {index < dataItems.length - 1 ? <Divider sx={{ marginBottom: 2 }} /> : null}
                                    </div>
                                );
                            })}
                            <Typography variant="caption" sx={{ marginBottom: 2 }}>
                                {t("common.prevention.chart.not_reported")}
                            </Typography>
                        </React.Fragment>
                    );
                })}
        </React.Fragment>
    );
};

export default PreventionChart;
