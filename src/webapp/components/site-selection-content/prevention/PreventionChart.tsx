import * as React from "react";
import { Divider, Typography } from "@mui/material";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useTranslation } from "react-i18next";
import { SelectionData } from "../../../store/SelectionData";
import { preventionBarChartOptions } from "./preventionChartUtils";
import { PreventionMapType } from "../../../store/types";

type Props = {
    mapType: PreventionMapType;
    selectionData: SelectionData;
};

const PreventionChart: React.FC<Props> = ({ mapType, selectionData }) => {
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
            {Object.keys(data).map((specie, specieIndex) => {
                const dataItems = Object.keys(data[specie]);

                return (
                    <React.Fragment key={specie}>
                        <Typography color="primary" variant="body2" fontWeight="bold">
                            {t(specie)}
                        </Typography>
                        {dataItems.map((type, typeIndex) => {
                            return (
                                <>
                                    <Typography variant="caption" fontWeight="bold">
                                        {t(type)}
                                    </Typography>
                                    <div key={type}>
                                        <HighchartsReact
                                            highcharts={Highcharts}
                                            options={preventionBarChartOptions(
                                                mapType,
                                                data[specie][type],
                                                specieIndex === 0 && specieIndex === 0
                                            )}
                                        />
                                        {typeIndex < dataItems.length - 1 ? <Divider sx={{ marginBottom: 2 }} /> : null}
                                    </div>
                                </>
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
