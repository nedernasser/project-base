import {Table, Model, Column, AutoIncrement, PrimaryKey, DataType} from 'sequelize-typescript'

export enum DocumentType {
  CNPJ = 'CNPJ',
  CPF = 'CPF'
}

export interface WatchlistAttributes {
  id: bigint
  documentType: DocumentType
  document: string
  reason: string
  description?: string
  isActive: boolean
}

@Table({
  timestamps: true
})
export default class Watchlist extends Model<WatchlistAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id: bigint
  @Column(DataType.ENUM(...Object.values(DocumentType)))
  documentType: DocumentType
  @Column(DataType.STRING(14))
  document: string
  @Column(DataType.STRING(100))
  reason: string
  @Column(DataType.STRING(150))
  description?: string
  @Column(DataType.BOOLEAN)
  isActive: boolean
}
