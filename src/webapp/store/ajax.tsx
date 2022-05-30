import { catchError, map } from "rxjs/operators";
import { ajax, AjaxError, AjaxResponse } from "rxjs/ajax";
import config from "../config";

interface AjaxOptions {
    method: string;
    path: string;
    body?: Record<string, any>;
    headers?: Record<string, any>;
    customPath?: boolean;
    responseType?: string;
    params?: RequestParams;
}

interface RequestParams {
    [key: string]: string | number | boolean;
}

const extractResponse = <T extends unknown>(res: AjaxResponse<T>) => {
    return res.response;
};

const handleUnauthorized = async (error: AjaxError) => {
    const message =
        error.response && !!error.response.message ? error.response.message : JSON.stringify(error.response);
    console.error(
        "Error",
        `Method: ${error.request.method}, URL: ${error.request.url}`,
        `Error code: ${error.status} Error response: ${message}`
    );
    throw error;
};

const buildAjaxOptions = ({ method, path, customPath, body, headers }: AjaxOptions) => ({
    method,
    body,
    headers,
    crossDomain: true,
    url: customPath ? path : `${config.mapServerUrl}${path}`,
});

const makeRequestAndHandleUnauthorized = <T extends unknown>(config: AjaxOptions) =>
    ajax<T>(buildAjaxOptions(config)).pipe(map(extractResponse), catchError(handleUnauthorized));

export const get = <T extends unknown>(path: string) =>
    makeRequestAndHandleUnauthorized<T>({
        method: "GET",
        path,
    });

export const getUrl = <T extends unknown>(url: string) => {
    const options = {
        method: "GET",
        url: url,
    };
    return ajax<T>(options).pipe(map(extractResponse), catchError(handleUnauthorized));
};

export const getFull = <T extends unknown>(path: string) =>
    makeRequestAndHandleUnauthorized<T>({
        method: "GET",
        path,
        customPath: true,
    });

export const postFull = <T extends unknown>(path: string, request: any) =>
    makeRequestAndHandleUnauthorized<T>({
        method: "POST",
        path,
        body: request,
        headers: {
            "Content-Type": "application/json",
        },
        customPath: true,
    });

export const patchFull = <T extends unknown>(path: string, request: any) =>
    makeRequestAndHandleUnauthorized<T>({
        method: "PATCH",
        path,
        body: request,
        headers: {
            "Content-Type": "application/json",
        },
        customPath: true,
    });
