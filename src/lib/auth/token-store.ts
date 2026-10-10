/**
 * Access tokens live in module memory, never in localStorage or a readable
 * cookie: a token kept in storage survives a tab close and is reachable by any
 * script on the page. The long-lived credential is the HttpOnly refresh
 * cookie, which restores the session on load.
 */
let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string): void {
  accessToken = token;
}

export function clearTokens(): void {
  accessToken = null;
}
