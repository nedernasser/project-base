import {singleton} from 'tsyringe'
import Business from 'src/models/business.model'
import {BaseRepository, IBaseRepository} from './base.repos'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IBusinessRepository extends IBaseRepository<Business> {}

@singleton()
export class BusinessRepository extends BaseRepository<Business> implements IBusinessRepository {
  constructor() {
    super(Business)
  }
}
