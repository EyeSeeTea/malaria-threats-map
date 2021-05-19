import { AxiosBuilder, axiosRequest } from "./future-axios";
import { AxiosRequestConfig } from "axios";
import { Future } from "../../common/Future";

type DefaultError = { message: string };

const defaultBuilder: AxiosBuilder<DefaultError> = {
    mapResponse: res => {
        if (res.status >= 200 && res.status < 300 && res.data) {
            return ["success", res.data];
        } else {
            return ["error", { message: JSON.stringify(res.data) }];
        }
    },
    mapNetworkError: (_req, message) => ({ message }),
};
export function request<Data>(config: AxiosRequestConfig): Future<DefaultError, Data> {
    return axiosRequest<DefaultError, Data>(defaultBuilder, config);
}
