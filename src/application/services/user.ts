import { APIGatewayProxyEventV2WithJWTAuthorizer } from 'aws-lambda'

import { db } from '../../main/database'
import { HttpError } from '../errors/HttpError'

export async function getAuthenticatedUser(
  event: APIGatewayProxyEventV2WithJWTAuthorizer,
  requiredRole?: 'ADMIN',
) {
  const sub = event.requestContext?.authorizer?.jwt?.claims?.sub.toString()

  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.externalId, sub),
  })

  if (!user || (requiredRole && user?.role !== requiredRole)) {
    throw new HttpError(403, {
      error: "You're not allowed to access this resource.",
    })
  }

  return {
    user,
  }
}
