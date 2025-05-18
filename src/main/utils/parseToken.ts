export async function parseToken(authorizationHeader: string) {
  try {
    const [, payload] = authorizationHeader.split('.')
    const claims = JSON.parse(
      Buffer.from(payload, 'base64url').toString('utf-8'),
    )

    const roles = claims['cognito:groups'] ?? []

    return {
      roles,
      externalId: claims.sub?.toString(),
    }
  } catch {
    return null
  }
}
