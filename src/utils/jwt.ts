import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

export const signToken = (payload: object) => {
    return jwt.sign(payload, ENV.JWT_SECRET, {
        expiresIn:"10d",
    });
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, ENV.JWT_SECRET);
};