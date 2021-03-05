import { Input } from '@nestjs/cli/commands'
import { AbstractAction } from '@nestjs/cli/actions'
import { ListDatabasesAction } from './ListDatabasesAction'
import { ListCollectionsAction } from '../collection/ListCollectionsAction'
import { ListIndexesAction } from '../index/ListIndexesAction'

export class ListAction extends AbstractAction {
  public async handle(inputs: Input[], options: Input[]): Promise<void> {
    // Make sure subActions aren't exited
    options = options === undefined ? [] : options
    options.push({ name: 'subAction', value: true })

    await new ListDatabasesAction().handle(inputs, options)
    await new ListCollectionsAction().handle(inputs, options)
    await new ListIndexesAction().handle(inputs, options)

    process.exit(0)
  }
}
