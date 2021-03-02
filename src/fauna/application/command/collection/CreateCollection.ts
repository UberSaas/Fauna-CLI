import * as faunadb from 'faunadb'
const q = faunadb.query
import { Client } from 'faunadb'

export class CreateCollection {
  public execute(client: Client, collectionName: string): Promise<any> {
    return client.query(q.Do(q.CreateCollection({ name: collectionName })))
  }
}
