export function getTokenFromHeader(token: string) {
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  return token === ADMIN_PASSWORD;
}
