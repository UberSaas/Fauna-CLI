import * as faunadb from 'faunadb'
import { AbstractCommand } from '../../command/AbstractCommand'
const q = faunadb.query

export class GetCollectionNames extends AbstractCommand {
  public async execute(): Promise<string[]> {
    const collectionsPaginator = this.client.paginate(q.Collections())

    const collectionNames: string[] = []
    await collectionsPaginator.each((page) => {
      // @ts-ignore
      for (const collection of page) {
        collectionNames.push(collection.id)
      }
    })

    return collectionNames
  }
}
