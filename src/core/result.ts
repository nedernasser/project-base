import ApiError, {ErrorCode, ErrorMap} from '../const/error'

export class Result<T> {
  public isSuccess: boolean
  public isFailure: boolean
  public error?: ErrorCode
  private _value?: T

  private constructor(isSuccess: boolean, error?: ErrorCode, value?: T) {
    if (isSuccess && error) {
      throw new Error(`InvalidOperation: A result cannot be 
        successful and contain an error`)
    }
    if (!isSuccess && !error) {
      throw new Error(`InvalidOperation: A failing result 
        needs to contain an error message`)
    }

    this.isSuccess = isSuccess
    this.isFailure = !isSuccess
    this.error = error
    this._value = value

    Object.freeze(this)
  }

  public getValue(): T | undefined {
    if (!this.isSuccess) {
      throw new Error('Cant retrieve the value from a failed result.')
    }

    return this._value
  }

  public throw<U>(): Result<U> {
    const erroMap = ErrorMap[this.error ?? ErrorCode.GENERIC_ERROR]
    throw new ApiError(erroMap.status, this.error as number, erroMap.message)
  }

  public send(code: number, res: any): any {
    if (this.isFailure) {
      this.throw()
    } else {
      res.code(code).send(this._value)
    }
  }

  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, undefined, value)
  }

  public static fail<U>(error?: ErrorCode): Result<U> {
    return new Result<U>(false, error)
  }

  public static combine(results: Result<any>[]): Result<any> {
    for (const result of results) {
      if (result.isFailure) return result
    }

    return Result.ok<any>()
  }
}
