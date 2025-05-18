import { GetPresignedUrlController } from '../../application/controllers/GetPresignedUrlController'
import { s3Client } from '../clients/s3Client'

export function makeGetPresignedUrlController() {
  return new GetPresignedUrlController(s3Client)
}
