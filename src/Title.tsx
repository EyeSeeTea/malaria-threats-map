import * as React from "react";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "./config/i18next";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const options: Highcharts.Options = {
  title: {
    text: "My chart"
  },
  series: [
    {
      type: "line",
      data: [1, 2, 3]
    }
  ],
  credits: {
    enabled: false
  }
};

const Title = () => {
  const { t }: any = useTranslation("common");
  return (
    <React.Fragment>
      {/*<h1>{t("welcome.title", { framework: "react-i18next" })}</h1>*/}
      <HighchartsReact highcharts={Highcharts} options={options} />
    </React.Fragment>
  );
};
export default Title;
