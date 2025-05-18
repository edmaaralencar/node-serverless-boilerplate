import { IController } from '../../types/IController'
import { IHttpResponse } from '../../types/IHttp'

export class GetUserProfileController implements IController {
  async handler(): Promise<IHttpResponse> {
    return {
      statusCode: 200,
      body: {
        user: {
          id: 1,
        },
      },
    }
    // const isUserAuthenticated = request.user

    // if (!isUserAuthenticated) {
    //   throw new HttpError(401, { error: 'Unauthorized.' })
    // }

    // const user = await db.query.users.findFirst({
    //   where: (users, { eq }) => eq(users.id, isUserAuthenticated.id),
    // })

    // if (!user) {
    //   throw new HttpError(401, { error: 'Unauthorized.' })
    // }

    // return {
    //   statusCode: 200,
    //   body: {
    //     user,
    //   },
    // }
  }
}
