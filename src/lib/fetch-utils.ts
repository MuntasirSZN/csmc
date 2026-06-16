export async function safeFetch<T = any>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<{ data: T | null, error: Error | null }> {
  try {
    const response = await fetch(input, init)
    if (!response.ok) {
      const body = await response.json().catch(() => ({}))
      return {
        data: null,
        error: new Error(body.error || `Request failed: ${response.status}`),
      }
    }
    const data = await response.json()
    return { data, error: null }
  }
  catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error(String(err)),
    }
  }
}
