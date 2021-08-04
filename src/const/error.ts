export enum ErrorCode {
  GENERIC_ERROR = 1000,
}

export const ErrorMap = {
  [ErrorCode.GENERIC_ERROR]: {
    status: 400,
    message: 'Generic Error'
  },
}

export default class ApiError extends Error {
  status: number
  code: number
  message: string

  constructor(status: number, code: number, message: string) {
    super(message)

    this.status = status
    this.code = code
  }
}
