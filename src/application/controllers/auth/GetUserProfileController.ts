import { db } from '../../../main/database'
import { HttpError } from '../../errors/HttpError'
import { IController } from '../../types/IController'
import { IHttpRequest, IHttpResponse } from '../../types/IHttp'

export class GetUserProfileController implements IController {
  async handler(request: IHttpRequest<undefined>): Promise<IHttpResponse> {
    const isUserAuthenticated = request.user
    if (!isUserAuthenticated) {
      throw new HttpError(401, { error: 'Unauthorized.' })
    }

    const user = await db.query.users.findFirst({
      where: (users, { eq }) =>
        eq(users.externalId, isUserAuthenticated.externalId),
    })

    if (!user) {
      throw new HttpError(401, { error: 'Unauthorized.' })
    }

    return {
      statusCode: 200,
      body: {
        user,
      },
    }
  }
}
