export default class UserError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 400,
    public code: string = 'APP_ERROR',
  ) {
    super(message)
    this.name = 'UserError'
    Object.setPrototypeOf(this, UserError.prototype)
  }
}
