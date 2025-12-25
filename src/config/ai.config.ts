import Module = require("node:module");

export const AI_CONFIG = {
    FREE_REQUESTS_LIMIT: 10,

    DEFAULT_PROVIDER: "OPENAI" as "OPENAI" | "GROK",

    MODELS: {
        OPENAI: "gpt-4o-mini",
        GROK: "grok-2",
    }
}