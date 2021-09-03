import {container} from 'tsyringe'
import {BusinessRepository, IBusinessRepository} from './business.repos'
import {CompanyRepository, ICompanyRepository} from './company.repos'
import {IUserRepository, UserRepository} from './user.repos'

container.registerSingleton<IUserRepository>('UserRepository', UserRepository)
container.registerSingleton<ICompanyRepository>('CompanyRepository', CompanyRepository)
container.registerSingleton<IBusinessRepository>('BusinessRepository', BusinessRepository)
