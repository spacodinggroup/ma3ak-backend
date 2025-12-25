import dotenv from 'dotenv';

dotenv.config();

function required(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error ('Missing env variable: ${key}');
    }
    return value;
}

export const ENV = {
    PORT: process.env.PORT || "5000",

    JWT_SECRET: required("JWT_SECRET"),

    DATABASE_URL: required("DATABASE_URL"),

    OPENAI_KEY: required("OPENAI_KEY"),
    GROK_KEY: required("GROK_KEY"),
}