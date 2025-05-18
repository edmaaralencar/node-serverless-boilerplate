import { SignUpController } from '../../application/controllers/auth/SignUpController'
import { cognitoClient } from '../clients/cognitoClient'

export function makeSignupController() {
  return new SignUpController(cognitoClient)
}
