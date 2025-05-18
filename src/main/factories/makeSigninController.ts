import { SignInController } from '../../application/controllers/auth/SignInController'
import { cognitoClient } from '../clients/cognitoClient'

export function makeSigninController() {
  return new SignInController(cognitoClient)
}
