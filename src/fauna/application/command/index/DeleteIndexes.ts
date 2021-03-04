import * as faunadb from 'faunadb'
const q = faunadb.query
import { AbstractCommand } from '../AbstractCommand'

export class DeleteIndexes extends AbstractCommand {
  public execute(indexNames: string[]): Promise<any> {
    const promisesArray: Array<Promise<Record<string, any>>> = []

    indexNames.forEach((indexName) => {
      promisesArray.push(this.query(q.Do(q.Delete(q.Index(indexName)))))
    })

    return Promise.all(promisesArray)
  }
}
