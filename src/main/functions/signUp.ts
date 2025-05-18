import { makeSignupController } from '../factories/makeSignupController'
import { makeHandler } from '../middy/makeHandler'

export const handler = makeHandler(makeSignupController())
