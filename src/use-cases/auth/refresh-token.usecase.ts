import {IUseCase} from 'src/core/usecase'
import {Result} from 'src/core/result'
import {inject, singleton} from 'tsyringe'
import JWTToken, {IJWTService, JWTService} from '@services/token/jwt.service'
import {ErrorCode} from 'src/const/error'

export interface RefreshTokenUseCaseDTO {
  refreshToken: string
}

export type IRefreshTokenUseCase = IUseCase<RefreshTokenUseCaseDTO, JWTToken>

@singleton<IRefreshTokenUseCase>()
export class RefreshTokenUseCase implements IRefreshTokenUseCase {
  constructor(@inject(JWTService) private jwtService: IJWTService) {}

  async exec(data: RefreshTokenUseCaseDTO): Promise<Result<JWTToken>> {
    if (!data || !data.refreshToken) {
      return Result.fail(ErrorCode.UNAUTHORIZED_ERROR)
    }

    return await this.jwtService.refresh(data.refreshToken)
  }
}
