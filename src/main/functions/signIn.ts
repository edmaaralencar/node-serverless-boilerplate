import { makeSigninController } from '../factories/makeSigninController'
import { makeHandler } from '../middy/makeHandler'

export const handler = makeHandler(makeSigninController())
