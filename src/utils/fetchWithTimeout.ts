export async function fetchWithTimeout(
  url: string,
  timeoutMs: number = 8000,
  options: RequestInit = {}
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (error) {
    if ((error as Error).name === "AbortError") {
      throw new Error("Network timeout");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
