import { DatabaseSchema } from '../src/fauna/domain/schema/model/DatabaseSchema'

export const automationSchema: DatabaseSchema = {
  models: [
    {
      name: 'Event',
      identifiers: [],
      indexes: [
        {
          name: 'allEvents',
          terms: ['productStageId'],
          values: [],
          unique: false,
          sortable: true,
        },
        {
          name: 'allEventsByUserId',
          terms: ['productStageId', 'userId'],
          values: [],
          unique: false,
          sortable: true,
        },
      ],
      sortFields: ['createdAt', 'name'],
    },
  ],
}
