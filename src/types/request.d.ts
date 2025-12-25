import { Aiprovider } from "./ai.js";
import { Request } from "express";
export interface AiRequestBody {
    tool: string;
    prompt: string;
    provider: Aiprovider;
}
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        role: string;
        requests: number;
    };
}
export interface FileUploadRequest extends AuthenticatedRequest {
    file?: any;
}
//# sourceMappingURL=request.d.ts.map