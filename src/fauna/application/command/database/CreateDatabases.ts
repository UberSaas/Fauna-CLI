import * as faunadb from 'faunadb'
const q = faunadb.query
import { AbstractCommand } from '../AbstractCommand'

export class CreateDatabases extends AbstractCommand {
  public execute(databaseNames: string[]): Promise<any> {
    const promisesArray: Array<Promise<Record<string, any>>> = []

    databaseNames.forEach((databaseName) => {
      promisesArray.push(
        this.query(q.Do(q.CreateDatabase({ name: databaseName })))
      )
    })

    return Promise.all(promisesArray)
  }
}
