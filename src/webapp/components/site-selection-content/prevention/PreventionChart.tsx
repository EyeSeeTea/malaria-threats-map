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
                                            options={chartOptions(
                                                data[specie][type],
                                                getTranslations(),
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
