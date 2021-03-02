import * as faunadb from 'faunadb'
import { AbstractCommand } from '../../command/AbstractCommand'
const q = faunadb.query

export class GetDatabaseNames extends AbstractCommand {
  public async execute(): Promise<string[]> {
    const databasesPaginator = this.client.paginate(q.Databases())

    const databaseNames: string[] = []
    await databasesPaginator.each((page) => {
      // @ts-ignore
      for (const database of page) {
        databaseNames.push(database.id)
      }
    })

    return databaseNames
  }
}
