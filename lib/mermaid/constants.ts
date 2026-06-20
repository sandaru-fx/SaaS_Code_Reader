export const MERMAID_INK_IMG_BASE_URL = "https://mermaid.ink/img/";
export const MERMAID_INK_SVG_BASE_URL = "https://mermaid.ink/svg/";

/** Browsers and CDNs often reject extremely long image URLs. */
export const MAX_MERMAID_INK_URL_LENGTH = 8000;

/** Conservative source-size guard before encoding for Mermaid.ink. */
export const MAX_MERMAID_SOURCE_CHARS = 4000;
