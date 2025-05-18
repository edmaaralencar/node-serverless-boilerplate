import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  UsernameExistsException,
} from '@aws-sdk/client-cognito-identity-provider'
import { z } from 'zod'

import { env } from '../../../main/config/env'
import { db } from '../../../main/database'
import { users } from '../../../main/database/schema'
import { schemaValidator } from '../../../main/utils/schemaValidator'
import { HttpError } from '../../errors/HttpError'
import { IController } from '../../types/IController'
import { IHttpRequest, IHttpResponse } from '../../types/IHttp'

const schema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string().min(8),
})

type SignUpBody = z.infer<typeof schema>

export class SignUpController implements IController<SignUpBody> {
  constructor(private readonly cognitoClient: CognitoIdentityProviderClient) {}

  async handler(request: IHttpRequest<SignUpBody>): Promise<IHttpResponse> {
    const { success, data, errors } = schemaValidator(schema, request.body)

    if (!success) {
      throw new HttpError(400, { errors })
    }

    const { email, password, name } = data

    const signUpCommand = new SignUpCommand({
      ClientId: env.COGNITO_CLIENT_ID,
      Username: email,
      Password: password,
      UserAttributes: [{ Name: 'custom:role', Value: 'USER' }],
    })

    try {
      const response = await this.cognitoClient.send(signUpCommand)

      if (!response.UserSub) {
        throw new HttpError(400, {
          error: 'There was an error creating your account.',
        })
      }

      await db
        .insert(users)
        .values({
          externalId: response.UserSub,
          name,
          role: 'USER',
          email,
        })
        .returning()

      return {
        statusCode: 201,
      }
    } catch (error) {
      if (error instanceof UsernameExistsException) {
        throw new HttpError(400, { error: 'User already exists.' })
      }

      console.log(error)

      throw new HttpError(500, { error: (error as Error).name })
    }
  }
}
