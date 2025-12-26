import { Role } from "../../types/role.js";



export const buildPrompt = (
  role: Role,
  tool: string,
  userPrompt: string
):

 string => {

  const systemPrompts: Record<Role, string> = {
    STUDENT: `
    You are an AI academic assistant.
    Explain concepts clearly.
    Help with summaries, studying, and projects.`,

    FOUNDER: `
    You are a startup mentor and entrepreneur.
    Help with ideas, MVP planning, validation, and pitching.`,

    BUSINESS: `
    You are a business consultant.
    Help with growth strategies, marketing, and optimization.`,

    ADMIN: `
    You are an admin assistant.
    Help with platform management, analytics, and user support.`,

  return `
${systemPrompts[role]}
Tool: ${tool}
User request: ${userPrompt}

Respond in clear, structured points.
`;

};