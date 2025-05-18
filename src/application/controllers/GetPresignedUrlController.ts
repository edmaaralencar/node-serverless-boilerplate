import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { randomUUID } from 'crypto'
import { z } from 'zod'

import { schemaValidator } from '../../main/utils/schemaValidator'
import { HttpError } from '../errors/HttpError'
import { IController } from '../types/IController'
import { IHttpRequest, IHttpResponse } from '../types/IHttp'

const schema = z.object({
  fileName: z.string(),
})

interface IUploadBody {
  fileName: string
}

export class GetPresignedUrlController implements IController<IUploadBody> {
  constructor(private readonly s3Client: S3Client) {}

  async handler(request: IHttpRequest<IUploadBody>): Promise<IHttpResponse> {
    const { success, data, errors } = schemaValidator(schema, request.body)

    console.log({
      user: request.user,
    })

    if (!success) {
      throw new HttpError(400, { errors })
    }

    const { fileName } = data

    const fileKey = `${randomUUID()}-${fileName}`

    const s3Command = new PutObjectCommand({
      Bucket: 'boilerplate-public-dev',
      Key: fileKey,
    })

    const signedUrl = await getSignedUrl(this.s3Client, s3Command, {
      expiresIn: 300,
    })

    return {
      statusCode: 200,
      body: {
        signedUrl,
        fileKey,
      },
    }
  }
}
