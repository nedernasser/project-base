import {Table, Column, AutoIncrement, PrimaryKey, DataType} from 'sequelize-typescript'
import BaseModel from '@models/base-model'

export interface ILegalResponsibleAttributes {
  id?: bigint
  name: string
  document: string
  email: string
  phone: string
}

@Table({
  timestamps: true
})
export default class LegalResponsible extends BaseModel<ILegalResponsibleAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id: bigint
  @Column(DataType.STRING(150))
  name: string
  @Column(DataType.STRING(11))
  document: string
  @Column(DataType.STRING(150))
  email: string
  @Column(DataType.STRING(16))
  phone: string
}
