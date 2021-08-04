import {Validator} from 'jsonschema'

export const validator = new Validator()

export const watchlistSchema = {
  id: '/WatchlistSchema',
  type: 'object',
  properties: {
    documentType: {type: 'string', minLength: 3, maxLength: 4},
    document: {type: 'string', minLength: 11, maxLength: 14},
    reason: {type: 'string', minLength: 3, maxLength: 100},
    description: {type: 'string', minLength: 3, maxLength: 150},
    isActive: {type: 'boolean'}
  },
  required: ['documentType', 'document', 'reason']
}

validator.addSchema(watchlistSchema, watchlistSchema.id)
