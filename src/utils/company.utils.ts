import {companySizeTypes, ineligibleReasons, legalNatures, restrictiveActivities} from 'src/const'
import {container} from 'tsyringe'
import {Result} from 'src/core/result'
import {CNPJResponse} from 'src/services/external/cnpj.service'
import {IWatchlistGetUseCase, WatchlistGetUseCase} from 'src/use-cases/watchlist/get-watchlist.usecase'
import {getDiffDays} from './custom-validation.utils'
import {WatchlistReasonTypeEnum} from 'src/models/watchlist.model'

export async function getEligibility(data: CNPJResponse): Promise<Result<CNPJResponse>> {
  data.eligible = {
    isEligible: true,
    ineligibilityCode: ''
  }

  const watchlistGetUseCase = container.resolve<IWatchlistGetUseCase>(WatchlistGetUseCase)
  const watchlist = await watchlistGetUseCase.exec(data.document)

  if (watchlist.isSuccess) {
    data.eligible.isEligible = false

    if (watchlist.getValue()?.reason === WatchlistReasonTypeEnum.SCAM) {
      data.eligible.ineligibilityCode = ineligibleReasons.Commercial
    } else {
      data.eligible.ineligibilityCode = ineligibleReasons.Financial
    }
  }

  if (data.eligible.isEligible) {
    data.eligible.isEligible = restrictiveActivities.filter(x => x.Code === data.primaryActivity.code).length === 0

    if (!data.eligible.isEligible) {
      data.eligible.ineligibilityCode = ineligibleReasons.Commercial
    }
  }

  if (
    data.eligible.isEligible &&
    data.size === companySizeTypes.ME &&
    data.legalNature.description === legalNatures[2135].Description
  ) {
    const diffDays = getDiffDays(new Date(data.founded))
    const isGreaterThan3MonthsOld = diffDays > 89
    const isGreaterThan6MonthsOld = diffDays > 179
    if (!isGreaterThan3MonthsOld) {
      data.eligible.isEligible = false
      data.eligible.ineligibilityCode = ineligibleReasons.AgeLessThan3Months
    } else if (isGreaterThan3MonthsOld && !isGreaterThan6MonthsOld) {
      data.eligible.ineligibilityCode = ineligibleReasons.AgeBetween3And6Months
    }
  }
  return Result.ok(data)
}
