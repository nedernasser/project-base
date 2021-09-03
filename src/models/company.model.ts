import {Table, Column, AutoIncrement, PrimaryKey, DataType, ForeignKey, Default} from 'sequelize-typescript'

import LegalResponsible from './legal-responsible.model'
import BaseModel from '@models/base-model'

export interface ICompanyAttributes {
  id?: bigint
  legalResponsibleId?: bigint
  document: string
  commercialProposalAt?: Date
  commercialProposalApprovedBy?: string
  isActive: boolean
}

@Table({
  timestamps: true
})
export default class Company extends BaseModel<ICompanyAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id: bigint
  @ForeignKey(() => LegalResponsible)
  @PrimaryKey
  @Column(DataType.BIGINT)
  legalResponsibleId?: bigint
  @Column(DataType.STRING(14))
  document: string
  @Column(DataType.DATE)
  commercialProposalAt?: Date
  @Column(DataType.STRING(150))
  commercialProposalApprovedBy?: string
  @Default(true)
  @Column(DataType.BOOLEAN)
  isActive: boolean
}
