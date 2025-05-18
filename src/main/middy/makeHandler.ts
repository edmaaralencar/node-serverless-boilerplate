/* eslint-disable @typescript-eslint/no-explicit-any */
import middy from '@middy/core'
import httpJsonBodyParser from '@middy/http-json-body-parser'
import httpResponseSerializer from '@middy/http-response-serializer'

import { HttpError } from '../../application/errors/HttpError'
import { IController } from '../../application/types/IController'
import { parseToken } from '../utils/parseToken'
import { sanitizeObject } from '../utils/sanitizeObject'
import { errorHandler } from './middlewares/errorHandler'

export function makeHandler(
  controller: IController<any>,
  requiredRole?: 'admins',
) {
  const middyHandler = middy()
    .use(httpJsonBodyParser({ disableContentTypeError: true }))
    .use(errorHandler())
    .use(
      httpResponseSerializer({
        defaultContentType: 'application/json',
        serializers: [
          {
            regex: /^application\/json$/,
            serializer: ({ body }) => JSON.stringify(body),
          },
        ],
      }),
    )

  return middyHandler.handler(async (event) => {
    const authorizationHeader = event.headers.authorization

    if (!authorizationHeader) {
      return controller.handler({
        body: event.body,
        headers: sanitizeObject(event.headers ?? {}),
        params: sanitizeObject(event.pathParameters ?? {}),
        query: sanitizeObject(event.queryStringParameters ?? {}),
        user: null,
      })
    }

    const parsedToken = await parseToken(authorizationHeader)

    if (!parsedToken) {
      throw new HttpError(401, { error: 'Unauthorized.' })
    }

    const { externalId, roles } = parsedToken

    if (requiredRole && !roles.includes(requiredRole)) {
      throw new HttpError(403, {
        error: 'Você não tem permissão para acessar esse recurso.',
      })
    }

    return controller.handler({
      body: event.body,
      headers: sanitizeObject(event.headers ?? {}),
      params: sanitizeObject(event.pathParameters ?? {}),
      query: sanitizeObject(event.queryStringParameters ?? {}),
      user: {
        externalId,
      },
    })
  })
}
