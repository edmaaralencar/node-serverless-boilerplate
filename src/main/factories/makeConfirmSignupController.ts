import { ConfirmSignupController } from '../../application/controllers/auth/ConfirmSignupController'
import { cognitoClient } from '../clients/cognitoClient'

export function makeConfirmSignupController() {
  return new ConfirmSignupController(cognitoClient)
}
