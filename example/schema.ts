import { DatabaseSchema } from '../src/fauna/domain/schema/model/DatabaseSchema'

const exampleSchema: DatabaseSchema = {
  models: [
    {
      name: 'Person',
      requiredFilter: 'companyId',
      searchFields: ['firstName', 'lastName', 'somethingElse'],
      sortFields: ['firstName', 'lastName'],
      multiSort: true,
    },
    {
      name: 'Company',
      searchFields: ['companyName'],
      sortFields: ['companyName', 'createdAt'],
      multiSort: true,
    },
  ],
}

export default exampleSchema
