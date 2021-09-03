import {container} from 'tsyringe'
import {DecorateAll} from 'src/decorators/decorate-all.decorator'
import {Controller, GET, POST} from 'fastify-decorators'
import {Authorization} from 'src/decorators/authorization.decorator'
import {CompanyGetCNPJUseCase, ICompanyGetCNPJUseCase} from '../use-cases/company/search-cnpj.usecase'
import {CompanyPostUseCase, ICompanyPostUseCase} from 'src/use-cases/company/post.usecase'
import {BusinessPostUseCase, IBusinessPostUseCase} from 'src/use-cases/business/post.usecase'
import {IUserPostUseCase, UserPostUseCase} from 'src/use-cases/user/post.usecase'
import {Result} from 'src/core/result'
import {scoped} from 'src/utils/models.utils'
import {CompanyValidateUseCase, ICompanyValidateUseCase} from 'src/use-cases/company/validate-company.usecase'
import {CNPJResponse} from 'src/services/external/cnpj.service'
import { CompanyCreateBodySchema } from 'src/services/company/company.schema'
import { FastifyReply, FastifyRequest } from 'fastify'

@Controller('/companies')
@DecorateAll(Authorization)
export default class CompanyController {
  private readonly companyGetCNPJUseCase: ICompanyGetCNPJUseCase
  private readonly companyPostUseCase: ICompanyPostUseCase
  private readonly businessPostUseCase: IBusinessPostUseCase
  private readonly userPostUseCase: IUserPostUseCase
  private readonly companyValidateUseCase: ICompanyValidateUseCase

  constructor() {
    this.companyGetCNPJUseCase = container.resolve<ICompanyGetCNPJUseCase>(CompanyGetCNPJUseCase)
    this.companyPostUseCase = container.resolve<ICompanyPostUseCase>(CompanyPostUseCase)
    this.businessPostUseCase = container.resolve<IBusinessPostUseCase>(BusinessPostUseCase)
    this.userPostUseCase = container.resolve<IUserPostUseCase>(UserPostUseCase)
    this.companyValidateUseCase = container.resolve<ICompanyValidateUseCase>(CompanyValidateUseCase)
  }

  @GET('/:document')
  async searchHandler(req, res) {
    let result = await this.companyGetCNPJUseCase.exec(req.params.document)

    if (result.isSuccess) {
      result = await this.companyValidateUseCase.exec(result.getValue() as CNPJResponse)
    }

    result.send(200, res)
  }

  @POST('', {schema: {body: CompanyCreateBodySchema}})
  async createHandler(req: FastifyRequest<any>, res: FastifyReply): Promise<void> {
    const resultSearch = await this.companyGetCNPJUseCase.exec(req.body.company.document)

    if (resultSearch.isFailure) {
      return resultSearch.send(404, res)
    }

    await scoped(async () => {
      const company = await this.companyPostUseCase.exec(req.body.company)
      const user = await this.userPostUseCase.exec(req.body.user)

      if (company.isSuccess && user.isSuccess) {
        const business = await this.businessPostUseCase.exec({
          userId: user.getValue() as bigint,
          companyId: company.getValue() as bigint
        })

        const result = Result.ok({
          companyId: company.getValue(),
          userId: user.getValue(),
          businessId: business.getValue()
        })

        result.send(201, res)
      } else {
        throw new Error()
      }
    }).catch(() => {
      res.send(400)
    })
  }
}
