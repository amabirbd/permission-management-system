const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

export async function api(path: string, init?: RequestInit) {
  const accessToken = typeof window !== 'undefined' ? window.sessionStorage.getItem('access_token') : null;
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      'Content-Type': 'application/json',
      ...init?.headers
    }
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message = typeof body?.message === 'string' ? body.message : `API request failed: ${response.status}`;
    throw new ApiError(message, response.status);
  }
  return response.json();
}
