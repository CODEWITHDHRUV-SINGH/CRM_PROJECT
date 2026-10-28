/**
 * Parse FastAPI errors into a structured exception.
 *
 * FastAPI returns errors in two shapes:
 *  - { detail: "message" }                         → simple error
 *  - { detail: [{ loc, msg, type }, ...] }         → validation errors
 */

export class ApiException extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(message: string, status: number, code?: string, details?: unknown) {
    super(message);
    this.name = 'ApiException';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

interface FastAPIValidationItem {
  loc?: (string | number)[];
  msg?: string;
  type?: string;
}

export function parseApiError(response: Response, body: unknown): ApiException {
  // FastAPI error body — { detail: ... }
  if (body && typeof body === 'object' && 'detail' in body) {
    const detail = (body as { detail: unknown }).detail;

    // Validation errors array
    if (Array.isArray(detail)) {
      const messages = (detail as FastAPIValidationItem[])
        .map((item) => item.msg)
        .filter((msg): msg is string => Boolean(msg))
        .join(', ');
      return new ApiException(
        messages || 'Validation failed',
        response.status,
        'validation_error',
        detail,
      );
    }

    // Simple string detail
    if (typeof detail === 'string') {
      return new ApiException(detail, response.status, 'api_error');
    }
  }

  // Fallback by HTTP status
  return new ApiException(statusToMessage(response.status), response.status);
}

function statusToMessage(status: number): string {
  switch (status) {
    case 400: return 'Bad request';
    case 401: return 'Please log in to continue';
    case 403: return 'You do not have permission to do this';
    case 404: return 'Not found';
    case 409: return 'This record already exists';
    case 422: return 'Validation failed';
    case 429: return 'Too many requests. Please try again later.';
    case 500: return 'Server error. Please try again.';
    case 502:
    case 503:
    case 504: return 'Service unavailable. Please try again.';
    default: return `Request failed (${status})`;
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiException) return error.message;
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred';
}