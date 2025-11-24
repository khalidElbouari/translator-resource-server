export const cleanAIResponse = (text) => {
  if (!text) return "";

  return text
    // Remove any <think>, <analysis>, <reasoning>, or similar blocks
    .replace(/<[^>]*>[\s\S]*?<\/[^>]*>/g, "")

    // Remove any remaining tags like <think>, <analysis>, <reason>
    .replace(/<[^>]+>/g, "")

    // Remove English letters, numbers, symbols
    .replace(/[A-Za-z0-9]/g, "")

    // Remove symbols and formatting artifacts
    .replace(/[*_#`~>\-+=|{}[\]()]/g, "")

    // Remove repeated punctuation
    .replace(/[.,;:!?؟]{2,}/g, "")

    // Normalize spaces
    .replace(/\s+/g, " ")

    // Remove empty lines and trim
    .trim();
};
