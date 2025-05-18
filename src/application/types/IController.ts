import { IHttpRequest, IHttpResponse } from './IHttp'

export interface IController<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TBody extends Record<string, any> | undefined = undefined,
> {
  handler(request: IHttpRequest<TBody>): Promise<IHttpResponse>
}
