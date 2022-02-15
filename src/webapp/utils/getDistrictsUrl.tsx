import axios from "axios";

const districtsOption1 =
    "https://services.arcgis.com/5T5nSi527N4F7luB/arcgis/rest/services/Detailed_Boundary_ADM2/FeatureServer/0";
const districtsOption2 =
    "https://services.arcgis.com/5T5nSi527N4F7luB/arcgis/rest/services/Detailed_Boundary_ADM2/FeatureServer/2";

export default async function getDistrictsURL(): Promise<string> {
    const params = {
        f: "geojson",
        where: `1=0`, // We don't download data in this moment, only check the valid url
        outFields: "*",
    };

    return axios
        .request({ url: `${districtsOption1}/query`, params })
        .then(() => {
            return districtsOption1;
        })
        .catch(() => {
            return districtsOption2;
        });
}
