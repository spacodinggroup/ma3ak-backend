export declare const aiService: ({ user, tool, prompt, provider, }: {
    user: any;
    tool: string;
    prompt: string;
    provider?: "OPENAI" | "GROK";
}) => Promise<{
    provider: "OPENAI" | "GROK";
    response: string;
}>;
//# sourceMappingURL=ai.service.d.ts.map