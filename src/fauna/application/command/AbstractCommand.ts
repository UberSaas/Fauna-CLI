import { FaunaService } from '../../infrastructure/service/FaunaService'
import * as faunadb from 'faunadb'
import { ExprArg } from 'faunadb'

export abstract class AbstractCommand {
  protected client: faunadb.Client

  constructor() {
    this.client = new FaunaService().getClient()
  }

  abstract execute(...args: any): Promise<any>

  query(expr: ExprArg): Promise<any> {
    return this.client.query(expr)
  }
}
