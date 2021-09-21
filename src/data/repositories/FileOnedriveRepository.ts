import { FutureData } from "../../domain/common/FutureData";
import { FileRepository } from "../../domain/repositories/FileRepository";
import { Future } from "../../common/Future";

export class FileOnedriveRepository implements FileRepository {
    save(_file: File): FutureData<void> {
        // const params = {
        //     form: {
        //         //redirect_uri: "http://localhost:3000",
        //         client_id: "a2eed30f-5ae1-495c-b346-eb6c79ce908c", //client id
        //         scope: "https://graph.microsoft.com/.default",
        //         client_secret: "_IV7Q~mwpc6FJE1BYJ_t.KiGsN7xrI8-6l-bV", //TODO
        //         grant_type: 'client_credentials',
        //     },
        // };

        // const tenantId = "f8cdef31-a31e-4b4a-93e4-5f571e91255a"

        // debugger;

        // return request<any>({
        //     //url: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
        //     url:   `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
        //     params,
        // }).flatMap(response => {
        //     debugger;
        //     const onedrive_folder = "MalariaThreatsMap"; // Folder name on OneDrive

        //     const params = {
        //         headers: {
        //             Authorization: "Bearer " + JSON.parse(response).access_token,
        //             "Content-Type": file.type,
        //         },
        //         body: file,
        //     };

        //     return request<any>({
        //         url: "https://graph.microsoft.com/v1.0/drive/root:/" + onedrive_folder + "/" + file.name + ":/content",
        //         params,
        //     }).map(() => undefined);
        // });

        return Future.success(undefined);
    }
}
