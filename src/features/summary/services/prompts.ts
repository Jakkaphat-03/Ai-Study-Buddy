export const SUMMARY_PROMPTS = {
  short: `
Create a concise summary of the document in approximately 100 words.
Focus only on the main ideas.
`,

  detailed: `
Create a detailed summary of the document.
Explain the important concepts in a clear and structured way.
`,

  bullet: `
Summarize the document as bullet points.
Each bullet should describe one important concept.
`,

  "key-concepts": `
Extract only the key concepts from the document.
Return them as a numbered list with a short explanation.
`,
} as const;

export type SummaryType = keyof typeof SUMMARY_PROMPTS;