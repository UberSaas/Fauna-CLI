import * as faunadb from 'faunadb'
const q = faunadb.query
import { AbstractCommand } from '../AbstractCommand'

export class CreateIndex extends AbstractCommand {
  public execute(
    name: string,
    collectionName: string,
    unique?: boolean,
    terms?: string[],
    values?: string[]
  ): Promise<any> {
    let termsInput: any = undefined
    let valuesInput: any = undefined

    if (terms !== undefined) {
      termsInput = []

      terms.forEach((term) => {
        termsInput.push({
          field: ['data'].concat(term),
        })
      })
    }

    if (values !== undefined) {
      values.forEach((value) => {
        if (valuesInput === undefined) {
          valuesInput = []
        }

        valuesInput.push({ field: ['data', value] })
      })

      valuesInput.push({ field: ['ref'] })
    }

    return this.query(
      q.Do(
        q.CreateIndex({
          name,
          source: q.Collection(collectionName),
          unique: unique !== undefined ? unique : false,
          terms: termsInput,
          values: valuesInput,
        })
      )
    )
  }
}
