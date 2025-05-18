import { z } from 'zod'

interface IErrorResult<TOutput> {
  success: false
  data?: TOutput
  errors: unknown
}

interface ISuccessResult<TOutput> {
  success: true
  data: TOutput
  errors?: unknown
}

export function schemaValidator<TOutput>(
  schema: z.ZodType<TOutput>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any,
): IErrorResult<TOutput> | ISuccessResult<TOutput> {
  try {
    const { success, data, error } = schema.safeParse(body)

    if (!success) {
      return {
        success: false,
        errors: error?.issues,
      }
    }

    return {
      success: true,
      data,
    }
  } catch {
    return {
      success: false,
      errors: {
        message: 'Malformed body.',
      },
    }
  }
}
