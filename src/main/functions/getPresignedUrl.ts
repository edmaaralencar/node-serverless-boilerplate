import { makeGetPresignedUrlController } from '../factories/makeGetPresignedUrlController'
import { makeHandler } from '../middy/makeHandler'

export const handler = makeHandler(makeGetPresignedUrlController(), 'admins')
