/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IHttpRequest<TBody extends Record<string, any> | undefined> {
  body: TBody
  headers?: Record<string, string>
  params?: Record<string, string>
  query?: Record<string, string>
  user: {
    externalId: string
  } | null
}

export interface IHttpResponse {
  statusCode: number
  body?: Record<string, any>
  headers?: Record<string, string>
}
