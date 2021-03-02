import * as faunadb from 'faunadb'
const q = faunadb.query
import { Client } from 'faunadb'

export class CreateDatabase {
  public execute(client: Client, databaseName: string): Promise<any> {
    return client.query(q.Do(q.CreateDatabase({ name: databaseName })))
  }
}
