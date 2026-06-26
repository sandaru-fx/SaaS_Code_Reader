export function isMissingSchemaError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  const code = (error as { code?: string }).code;

  // PGRST205: table not in schema cache; 42P01: undefined_table (Postgres)
  return code === "PGRST205" || code === "42P01";
}
