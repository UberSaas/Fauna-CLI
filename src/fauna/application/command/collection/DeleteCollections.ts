import * as faunadb from 'faunadb'
const q = faunadb.query
import { AbstractCommand } from '../AbstractCommand'

export class DeleteCollections extends AbstractCommand {
  public execute(collectionNames: string[]): Promise<any> {
    const promisesArray: Array<Promise<Record<string, any>>> = []

    collectionNames.forEach((collectionName) => {
      promisesArray.push(
        this.query(q.Do(q.Delete(q.Collection(collectionName))))
      )
    })

    return Promise.all(promisesArray)
  }
}
