export const PROMPT_TEMPLATES = {
  translate: ({ tone = "neutral" }) =>
    `Translate the content to the target language. Tone: ${tone}. Keep meaning and nuance.`,
  summarize: ({ mode = "bullet" }) => {
    const styles = {
      bullet: "Return concise bullet points.",
      academic: "Return an academic-style summary: Intro, Methods, Results, Conclusion.",
      tldr: "Return a 2-line TL;DR."
    };
    return `Summarize the content. ${styles[mode] || styles.bullet}`;
  },
  explain: ({ level = "simple" }) =>
    `Explain the content at a ${level} level. Keep it clear and direct.`,
  rewrite: ({ tone = "formal" }) =>
    `Rewrite the content with a ${tone} tone. Preserve intent and facts.`,
  formAssist: ({ fieldLabel }) =>
    `Provide a best-fit answer for the form field "${fieldLabel}". Keep it concise and context-aware.`
};
