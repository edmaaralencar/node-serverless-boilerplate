import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  NotAuthorizedException,
  UserNotConfirmedException,
  UserNotFoundException,
} from '@aws-sdk/client-cognito-identity-provider'
import { z } from 'zod'

import { env } from '../../../main/config/env'
import { schemaValidator } from '../../../main/utils/schemaValidator'
import { HttpError } from '../../errors/HttpError'
import { IController } from '../../types/IController'
import { IHttpRequest, IHttpResponse } from '../../types/IHttp'

const schema = z.object({
  email: z.string(),
  password: z.string().min(8),
})

type SignInBody = z.infer<typeof schema>

export class SignInController implements IController<SignInBody> {
  constructor(private readonly cognitoClient: CognitoIdentityProviderClient) {}

  async handler(request: IHttpRequest<SignInBody>): Promise<IHttpResponse> {
    const { success, data, errors } = schemaValidator(schema, request.body)

    if (!success) {
      throw new HttpError(400, { errors })
    }

    const { email, password } = data

    const signInCommand = new InitiateAuthCommand({
      ClientId: env.COGNITO_CLIENT_ID,
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    })

    try {
      const { AuthenticationResult } =
        await this.cognitoClient.send(signInCommand)

      if (!AuthenticationResult) {
        throw new HttpError(401, { error: 'Invalid credentials.' })
      }

      return {
        statusCode: 200,
        body: {
          accessToken: AuthenticationResult.AccessToken,
          refreshToken: AuthenticationResult.RefreshToken,
        },
      }
    } catch (error) {
      if (
        error instanceof NotAuthorizedException ||
        error instanceof UserNotFoundException
      ) {
        throw new HttpError(401, { error: 'Invalid credentials.' })
      }

      if (error instanceof UserNotConfirmedException) {
        throw new HttpError(401, { error: 'Account not confirmed.' })
      }

      throw new HttpError(500, {
        error: (error as Error).name,
      })
    }
  }
}
