import * as faunadb from 'faunadb'
const q = faunadb.query
import { Client } from 'faunadb'

export class DeleteCollection {
  public execute(client: Client, collectionName: string): Promise<any> {
    return client.query(q.Do(q.Delete(q.Collection(collectionName))))
  }
}
