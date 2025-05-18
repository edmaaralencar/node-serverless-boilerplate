import { makeGetUserProfileController } from '../factories/makeGetUserProfileController'
import { makeHandler } from '../middy/makeHandler'

export const handler = makeHandler(makeGetUserProfileController())
