import { Response } from "express";

export const successResponse = (
    res: Response,
    data: any,
    statusCode: number = 200
) => {
    if (data === null || data === undefined) {
        return res.status(statusCode).json({
            success: true,
        });
    }

    if (Array.isArray(data)) {
        return res.status(statusCode).json({
            success: true,
            data,
        });
    }

    return res.status(statusCode).json({
        success: true,
        ...data,
    });
};

export const errorResponse = (
    res: Response,
    message: string,
    statusCode: number = 500
) => {
    return res.status(statusCode).json({
        success: false,
        message,
    });
};