import {
  CodeMismatchException,
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
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
  code: z.string(),
})

type ConfirmSignupBody = z.infer<typeof schema>

export class ConfirmSignupController implements IController<ConfirmSignupBody> {
  constructor(private readonly cognitoClient: CognitoIdentityProviderClient) {}

  async handler(
    request: IHttpRequest<ConfirmSignupBody>,
  ): Promise<IHttpResponse> {
    const { success, data, errors } = schemaValidator(schema, request.body)

    if (!success) {
      throw new HttpError(400, { errors })
    }

    const { email, code } = data

    const confirmSignupCommand = new ConfirmSignUpCommand({
      ClientId: env.COGNITO_CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
    })

    try {
      await this.cognitoClient.send(confirmSignupCommand)

      return {
        statusCode: 200,
      }
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new HttpError(404, { error: 'User not found.' })
      }

      if (error instanceof CodeMismatchException) {
        throw new HttpError(400, { error: 'Invalid code.' })
      }

      throw new HttpError(500, { error: (error as Error).name })
    }
  }
}
