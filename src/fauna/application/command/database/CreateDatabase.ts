import * as faunadb from 'faunadb'
const q = faunadb.query
import { AbstractCommand } from '../AbstractCommand'

export class CreateDatabase extends AbstractCommand {
  public execute(databaseName: string): Promise<any> {
    return this.query(q.Do(q.CreateDatabase({ name: databaseName })))
  }
}
