import {Type} from '@sinclair/typebox'
import { UserCreateBodySchema } from '../user/user.schema'

export const CompanyCreateBodySchema = Type.Object({
  user: UserCreateBodySchema,
  company: Type.Object({
    document: Type.String({
      minLength: 14,
      maxLength: 14
    })
  })
})
