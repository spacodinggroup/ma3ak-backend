export const successResponse = (res, data, statusCode = 200) => {
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
export const errorResponse = (res, message, statusCode = 500) => {
    return res.status(statusCode).json({
        success: false,
        message,
    });
};
//# sourceMappingURL=response.js.map