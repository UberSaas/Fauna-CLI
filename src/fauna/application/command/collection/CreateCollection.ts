import * as faunadb from 'faunadb'
const q = faunadb.query
import { AbstractCommand } from '../AbstractCommand'

export class CreateCollection extends AbstractCommand {
  public execute(collectionName: string): Promise<any> {
    return this.query(q.Do(q.CreateCollection({ name: collectionName })))
  }
}
