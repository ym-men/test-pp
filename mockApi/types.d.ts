declare namespace Express {
    export interface Request {
        files?: Record<string, Record<string, {
            path: string;
        }>>
    }
}