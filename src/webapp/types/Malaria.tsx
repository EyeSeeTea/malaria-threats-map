export interface ErrorResponse {
    error: {
        code: number;
        message: string;
        details: string[];
    };
}
