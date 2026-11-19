const API_BASE_URL = 'https://api.apbugall.org/';
const TOKEN = '45e20a5f584becf7a64dffb7174ddf';

/**
 * Requests the catalog API.
 *
 * Keep the API token out of the source tree. Note that VITE_* variables are
 * still included in the browser bundle; a server-side proxy is required if
 * the provider treats this token as a secret.
 */
export async function apiRequest<T>(
  params: Record<string, string | number | undefined>,
  signal?: AbortSignal,
): Promise<T> {

  const url = new URL(API_BASE_URL);
  url.searchParams.set('token', TOKEN);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Ошибка API: ${response.status}`);
  }

  return response.json() as Promise<T>;
}
