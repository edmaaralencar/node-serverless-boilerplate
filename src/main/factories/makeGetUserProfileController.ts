import { GetUserProfileController } from '../../application/controllers/auth/GetUserProfileController'

export function makeGetUserProfileController() {
  return new GetUserProfileController()
}
