import {singleton} from 'tsyringe'
import Company from 'src/models/company.model'
import {BaseRepository, IBaseRepository} from './base.repos'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICompanyRepository extends IBaseRepository<Company> {}

@singleton()
export class CompanyRepository extends BaseRepository<Company> implements ICompanyRepository {
  constructor() {
    super(Company)
  }
}
