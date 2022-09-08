import config from "./webapp/config";
import { UseCase } from "./domain/common/UseCase";
import { PreventionApiRepository } from "./data/repositories/PreventionApiRepository";
import { GetPreventionStudiesUseCase } from "./domain/usecases/GetPreventionStudiesUseCase";
import { DiagnosisApiRepository } from "./data/repositories/DiagnosisApiRepository";
import { GetDiagnosisStudiesUseCase } from "./domain/usecases/GetDiagnosisStudiesUseCase";
import { TreatmentApiRepository } from "./data/repositories/TreatmentApiRepository";
import { GetTreatmentStudiesUseCase } from "./domain/usecases/GetTreatmentStudiesUseCase";
import { InvasiveApiRepository } from "./data/repositories/InvasiveApiRepository";
import { GetInvasiveStudiesUseCase } from "./domain/usecases/GetInvasiveStudiesUseCase";
import { CountryLayerApiRepository } from "./data/repositories/CountryLayerApiRepository";
import { GetCountryLayerUseCase } from "./domain/usecases/GetCountryLayerUseCase";
import { SmtpJsEmailRepository } from "./data/repositories/SmtpJsEmailRepository";
import { UploadFileUseCase } from "./domain/usecases/UploadFileUseCase";
import getDistrictsUrl from "./webapp/utils/getDistrictsUrl";
import { SendFeedbackUseCase } from "./domain/usecases/SendFeedbackUseCase";

export class CompositionRoot {
    private preventionRepository = new PreventionApiRepository(config.mapServerUrl);
    private diagnosisRepository = new DiagnosisApiRepository(config.mapServerUrl);
    private treatmentRepository = new TreatmentApiRepository(config.mapServerUrl);
    private invasiveRepository = new InvasiveApiRepository(config.xmartServerUrl);
    private countryLayerRepository = new CountryLayerApiRepository(config.featuresServerUrl, config.backendUrl);
    private emailRepository = new SmtpJsEmailRepository(config.feedbackEmailSecureToken);
    private _districtsUrl: string;

    constructor() {
        this.initDistrictsUrl();
    }

    public get prevention() {
        return getExecute({
            getStudies: new GetPreventionStudiesUseCase(this.preventionRepository),
        });
    }

    public get diagnosis() {
        return getExecute({
            getStudies: new GetDiagnosisStudiesUseCase(this.diagnosisRepository),
        });
    }

    public get treatment() {
        return getExecute({
            getStudies: new GetTreatmentStudiesUseCase(this.treatmentRepository),
        });
    }

    public get invasive() {
        return getExecute({
            getStudies: new GetInvasiveStudiesUseCase(this.invasiveRepository),
        });
    }

    public get countryLayer() {
        return getExecute({
            get: new GetCountryLayerUseCase(this.countryLayerRepository),
        });
    }

    public get uploadFile() {
        return getExecute({
            save: new UploadFileUseCase(this.emailRepository, config.feedbackEmailFrom, config.feedbackEmailTo),
        });
    }

    public get districtsUrl() {
        return this._districtsUrl;
    }

    public get feedback() {
        return getExecute({
            send: new SendFeedbackUseCase(this.emailRepository, config.feedbackEmailFrom, config.feedbackEmailTo),
        });
    }

    private async initDistrictsUrl() {
        this._districtsUrl = await getDistrictsUrl();
    }
}

function getExecute<UseCases extends Record<Key, UseCase>, Key extends keyof UseCases>(
    useCases: UseCases
): { [K in Key]: UseCases[K]["execute"] } {
    const keys = Object.keys(useCases) as Key[];
    const initialOutput = {} as { [K in Key]: UseCases[K]["execute"] };

    return keys.reduce((output, key) => {
        const useCase = useCases[key];
        const execute = useCase.execute.bind(useCase) as UseCases[typeof key]["execute"];
        output[key] = execute;
        return output;
    }, initialOutput);
}
