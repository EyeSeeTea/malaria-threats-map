import { request } from "../common/request";
import { FutureData } from "../../domain/common/FutureData";
import { XMartApiResponse } from "../common/types";
import { Future } from "../../common/Future";
import { TranslationRepository } from "../../domain/repositories/TranslationRepository";
import { Translation } from "../../domain/entities/Translation";

export class TranslationApiRepository implements TranslationRepository {
    constructor(private baseUrl: string) {}

    get(): FutureData<Translation[]> {
        return request<XMartApiResponse<Translation>>({ url: `${this.baseUrl}/TRANSLATIONS` })
            .map(response => response.value)
            .flatMapError(error => {
                console.log("error loading translations from xmart", error);
                return Future.success([]);
            });
    }

}
