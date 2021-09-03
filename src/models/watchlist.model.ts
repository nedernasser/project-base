import {Table, Column, AutoIncrement, PrimaryKey, DataType, Default} from 'sequelize-typescript'
import BaseModel from '@models/base-model'

export enum DocumentTypeEnum {
  CNPJ = 'CNPJ',
  CPF = 'CPF'
}

export enum WatchlistReasonTypeEnum {
  FINANCIAL_PENDING = 'FINANCIAL_PENDING',
  BLOCKED = 'BLOCKED',
  SCAM = 'SCAM'
}

export interface IWatchlistAttributes {
  id?: bigint
  documentType: DocumentTypeEnum
  document: string
  reason: WatchlistReasonTypeEnum
  description?: string
  isActive: boolean
}

@Table({
  timestamps: true
})
export default class Watchlist extends BaseModel<IWatchlistAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id: bigint
  @Column(DataType.ENUM(...Object.values(DocumentTypeEnum)))
  documentType: DocumentTypeEnum
  @Column(DataType.STRING(14))
  document: string
  @Default(WatchlistReasonTypeEnum.BLOCKED)
  @Column(DataType.ENUM(...Object.values(WatchlistReasonTypeEnum)))
  reason: WatchlistReasonTypeEnum
  @Column(DataType.STRING(150))
  description?: string
  @Default(true)
  @Column(DataType.BOOLEAN)
  isActive: boolean
}
