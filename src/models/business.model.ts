import {Table, Column, AutoIncrement, PrimaryKey, DataType, ForeignKey, BelongsTo, Default} from 'sequelize-typescript'

import Company from './company.model'
import User from './users.model'
import BaseModel from '@models/base-model'

export enum StepEnum {
  BEGIN = 'BEGIN',
  MEMBERS = 'MEMBERS'
}

export interface IBusinessAttributes {
  id?: bigint
  companyId: bigint
  userId: bigint
  step?: string
  sellerId?: string
}

@Table({
  timestamps: true
})
export default class Business extends BaseModel<IBusinessAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id: bigint
  @ForeignKey(() => Company)
  @PrimaryKey
  @Column(DataType.BIGINT)
  companyId?: bigint
  @ForeignKey(() => User)
  @PrimaryKey
  @Column(DataType.BIGINT)
  userId?: bigint
  @Default('BEGIN')
  @Column(DataType.STRING(45))
  step?: string
  @Column(DataType.STRING(45))
  sellerId?: string

  @BelongsTo(() => User)
  user: User

  @BelongsTo(() => Company)
  company: Company
}
