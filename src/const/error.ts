export enum ErrorCode {
  GENERIC_ERROR = 1000,
  DUPLICATED_WATCHLIST_ERROR = 6000,
  DUPLICATED_USER_ERROR = 6001,
  DUPLICATED_COMPANY_ERROR = 6002,
  DUPLICATED_BUSINESS_ERROR = 6003,
  NOT_FOUND_WATCHLIST_ERROR = 4000,
  UNAUTHORIZED_ERROR = 4001,
  NOT_FOUND_COMPANY_ERROR = 4002,
  NOT_FOUND_USER_ERROR = 4003
}

export const ErrorMap = {
  [ErrorCode.GENERIC_ERROR]: {
    status: 400,
    message: 'Generic Error'
  },
  [ErrorCode.DUPLICATED_WATCHLIST_ERROR]: {
    status: 400,
    message: 'Duplicated watchlist'
  },
  [ErrorCode.DUPLICATED_USER_ERROR]: {
    status: 400,
    message: 'Duplicated user'
  },
  [ErrorCode.DUPLICATED_COMPANY_ERROR]: {
    status: 400,
    message: 'Duplicated company'
  },
  [ErrorCode.DUPLICATED_BUSINESS_ERROR]: {
    status: 400,
    message: 'Duplicated business'
  },
  [ErrorCode.NOT_FOUND_WATCHLIST_ERROR]: {
    status: 404,
    message: 'Watchlist not found'
  },
  [ErrorCode.NOT_FOUND_COMPANY_ERROR]: {
    status: 404,
    message: 'Company not found'
  },
  [ErrorCode.NOT_FOUND_USER_ERROR]: {
    status: 404,
    message: 'User not found'
  },
  [ErrorCode.UNAUTHORIZED_ERROR]: {
    status: 401,
    message: 'Unauthorized'
  }
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
