export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    message?: Record<string, any>,
  ) {
    super(JSON.stringify(message))

    this.name = 'HttpError'
  }
}
