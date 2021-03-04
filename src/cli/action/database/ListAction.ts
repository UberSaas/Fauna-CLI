import { Input } from '@nestjs/cli/commands'
import { AbstractAction } from '@nestjs/cli/actions'
import { ListDatabasesAction } from './ListDatabasesAction'
import { ListCollectionsAction } from '../collection/ListCollectionsAction'

export class ListAction extends AbstractAction {
  public async handle(inputs: Input[], options: Input[]): Promise<void> {
    options = options === undefined ? [] : options
    options.push({ name: 'subAction', value: true })

    await new ListDatabasesAction().handle(inputs, options)
    await new ListCollectionsAction().handle(inputs, options)

    process.exit(0)
  }
}
