import * as faunadb from 'faunadb'
const q = faunadb.query
import { AbstractCommand } from '../AbstractCommand'

export class DeleteDatabase extends AbstractCommand {
  public execute(databaseName: string): Promise<any> {
    return this.query(q.Do(q.Delete(q.Database(databaseName))))
  }
}
