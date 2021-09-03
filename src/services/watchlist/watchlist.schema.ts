import {Type} from '@sinclair/typebox'
import {DocumentTypeEnum} from '@models/watchlist.model'

export const WatchlistCreateBodySchema = Type.Object({
  documentType: Type.Enum(DocumentTypeEnum),
  document: Type.String({
    minLength: 11,
    maxLength: 14
  }),
  description: Type.String({
    minLength: 3,
    maxLength: 150
  }),
  isActive: Type.Optional(Type.Boolean())
})

export const WatchlistUpdateBodySchema = Type.Object({
  documentType: Type.Optional(Type.Enum(DocumentTypeEnum)),
  document: Type.Optional(
    Type.String({
      minLength: 11,
      maxLength: 14
    })
  ),
  description: Type.Optional(
    Type.String({
      minLength: 3,
      maxLength: 150
    })
  ),
  isActive: Type.Optional(Type.Boolean())
})
