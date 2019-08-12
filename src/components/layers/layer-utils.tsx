import { Study } from "../../types/Malaria";
export const circleLayout = { visibility: "visible" };
export const circlePaint = {
  "circle-color": "#E54E52"
};

export const studiesToGeoJson = (studies: Study[]) => ({
  type: "FeatureCollection",
  features: studies.map(study => ({
    type: "Feature",
    properties: {
      ...study
    },
    geometry: {
      type: "Point",
      coordinates: [parseFloat(study.Longitude), parseFloat(study.Latitude)]
    }
  }))
});
