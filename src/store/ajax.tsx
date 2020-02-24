import * as R from "ramda";
import { catchError, map } from "rxjs/operators";
import { ajax, AjaxError, AjaxResponse } from "rxjs/ajax";
import config from "../config";

interface AjaxOptions {
  method: string;
  path: string;
  body?: Record<string, any>;
  customPath?: boolean;
  responseType?: string;
  params?: RequestParams;
}

interface RequestParams {
  [key: string]: string | number | boolean;
}

const extractResponse = (res: AjaxResponse) => {
  return res.response;
};

const handleUnauthorized = async (error: AjaxError) => {
  const message =
    error.response && !!error.response.message
      ? error.response.message
      : JSON.stringify(error.response);
  console.error(
    "Error",
    `Method: ${error.request.method}, URL: ${error.request.url}`,
    `Error code: ${error.status} Error response: ${message}`
  );
  throw error;
};

const buildAjaxOptions = ({ method, path, customPath }: AjaxOptions) => ({
  method,
  url: customPath ? path : `${config.mapServerUrl}${path}`
});

const makeRequestAndHandleUnauthorized = (config: AjaxOptions) =>
  ajax(buildAjaxOptions(config)).pipe(
    map(extractResponse),
    catchError(handleUnauthorized)
  );

export const get = R.curry((path: string) =>
  makeRequestAndHandleUnauthorized({
    method: "GET",
    path
  })
);

export const getFull = R.curry((path: string) =>
  makeRequestAndHandleUnauthorized({
    method: "GET",
    path,
    customPath: true
  })
);
