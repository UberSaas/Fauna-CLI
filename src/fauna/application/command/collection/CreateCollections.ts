import * as faunadb from 'faunadb'
const q = faunadb.query
import { AbstractCommand } from '../AbstractCommand'

export class CreateCollections extends AbstractCommand {
  public execute(collectionNames: string[]): Promise<any> {
    const promisesArray: Array<Promise<Record<string, any>>> = []

    collectionNames.forEach((collectionName) => {
      promisesArray.push(
        this.query(q.Do(q.CreateCollection({ name: collectionName })))
      )
    })

    return Promise.all(promisesArray)
  }
}
