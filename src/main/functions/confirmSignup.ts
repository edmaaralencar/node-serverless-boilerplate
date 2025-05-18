import { makeConfirmSignupController } from '../factories/makeConfirmSignupController'
import { makeHandler } from '../middy/makeHandler'

export const handler = makeHandler(makeConfirmSignupController())
