import * as faunadb from 'faunadb'
const q = faunadb.query
import { Client } from 'faunadb'

export class DeleteDatabase {
  public execute(client: Client, databaseName: string): Promise<any> {
    return client.query(q.Do(q.Delete(q.Database(databaseName))))
  }
}
