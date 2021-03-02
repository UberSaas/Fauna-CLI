import * as faunadb from 'faunadb'

export class FaunaService {
  getClient(): faunadb.Client {
    if (process.env.FAUNADB_SERVER_SECRET == null) {
      throw Error('No FAUNADB_SERVER_SECRET')
    }

    return new faunadb.Client({
      secret: process.env.FAUNADB_SERVER_SECRET,
    })
  }
}
