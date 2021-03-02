import * as faunadb from 'faunadb'
const q = faunadb.query
import { AbstractCommand } from '../AbstractCommand'

export class DeleteCollection extends AbstractCommand {
  public execute(collectionName: string): Promise<any> {
    return this.query(q.Do(q.Delete(q.Collection(collectionName))))
  }
}
