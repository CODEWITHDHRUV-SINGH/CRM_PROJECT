export function getApiErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'An unexpected API error occurred.';
}