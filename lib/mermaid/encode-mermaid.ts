function toBase64(bytes: Uint8Array): string {
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
}

export function encodeMermaidForInk(mermaid: string): string {
  const bytes = new TextEncoder().encode(mermaid);
  const base64 = toBase64(bytes);

  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
