export class ApiError extends Error {
  constructor(public code: string, message: string, public details?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleSupabaseError(error: any): never {
  console.error('API Error:', error);
  throw new ApiError(
    error.code || 'UNKNOWN_ERROR',
    error.message || 'Bir hata oluştu',
    error.details
  );
}