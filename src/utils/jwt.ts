import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

export const signToken = (payload: object) => {
    if (!ENV.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }
    return jwt.sign(payload, ENV.JWT_SECRET, {
        expiresIn: "1d",
    });
};


export const verifyToken = (token: string) => {
    if (!ENV.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }
    return jwt.verify(token, ENV.JWT_SECRET);
};

