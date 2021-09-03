import {Table, Column, AutoIncrement, PrimaryKey, DataType, HasMany, Default} from 'sequelize-typescript'

import Business from './business.model'
import BaseModel, {JsonIgnore} from '@models/base-model'

export interface IUsersAttributes {
  id?: bigint
  name: string
  phone: string
  totpKey: string
  email?: string
  verified: boolean
  lastLogin?: Date
  isActive: boolean
}

@Table({
  timestamps: true
})
export default class User extends BaseModel<IUsersAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id: bigint
  @Column(DataType.STRING(150))
  name: string
  @Column(DataType.STRING(16))
  phone: string
  @Column(DataType.STRING(100))
  @JsonIgnore()
  totpKey: string
  @Column(DataType.STRING(150))
  email?: string
  @Default(false)
  @Column(DataType.BOOLEAN)
  verified: boolean
  @Column(DataType.DATE)
  lastLogin?: Date
  @Default(true)
  @Column(DataType.BOOLEAN)
  isActive: boolean

  @HasMany(() => Business)
  business: Business[]
}
