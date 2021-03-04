import * as faunadb from 'faunadb'
import { AbstractCommand } from '../../command/AbstractCommand'
const q = faunadb.query

export class GetIndexNames extends AbstractCommand {
  public async execute(): Promise<string[]> {
    const indexesPaginator = this.client.paginate(q.Indexes())

    const indexNames: string[] = []
    await indexesPaginator.each((page) => {
      // @ts-ignore
      for (const index of page) {
        indexNames.push(index.id)
      }
    })

    return indexNames
  }
}
