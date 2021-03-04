import * as chalk from 'chalk'
import { CommanderStatic } from 'commander'
import { ERROR_PREFIX } from '@nestjs/cli/lib/ui'
import { CreateDatabaseAction, TestAction } from '../action'
import { CreateDatabaseCommand } from './database/CreateDatabaseCommand'
import { TestCommand } from './TestCommand'
import { DeleteDatabasesCommand } from './database/DeleteDatabasesCommand'
import { DeleteDatabasesAction } from '../action/database/DeleteDatabasesAction'
import { CreateCollectionsCommand } from './collection/CreateCollectionsCommand'
import { CreateCollectionsAction } from '../action/collection/CreateCollectionsAction'
import { DeleteCollectionsCommand } from './collection/DeleteCollectionsCommand'
import { DeleteCollectionsAction } from '../action/collection/DeleteCollectionsAction'
import { ListCollectionsCommand } from './collection/ListCollectionsCommand'
import { ListCollectionsAction } from '../action/collection/ListCollectionsAction'
import { ListDatabasesCommand } from './database/ListDatabasesCommand'
import { ListDatabasesAction } from '../action/database/ListDatabasesAction'
import { DeleteAllCollectionsCommand } from './collection/DeleteAllCollectionsCommand'
import { DeleteAllCollectionsAction } from '../action/collection/DeleteAllCollectionsAction'
import { DeleteAllDatabasesCommand } from './database/DeleteAllDatabasesCommand'
import { DeleteAllDatabasesAction } from '../action/database/DeleteAllDatabasesAction'
import { SweepDatabaseCommand } from './database/SweepDatabaseCommand'
import { SweepDatabaseAction } from '../action/database/SweepDatabaseAction'
import { ListCommand } from './database/ListCommand'
import { ListAction } from '../action/database/ListAction'
import { ListIndexesAction } from '../action/index/ListIndexesAction'
import { CreateIndexAction } from '../action/index/CreateIndexAction'
import { CreateIndexCommand } from './index/CreateIndexCommand'
import { ListIndexesCommand } from './index/ListIndexesCommand'

export class CommandLoader {
  public static load(program: CommanderStatic): void {
    new TestCommand(new TestAction()).load(program)

    // Database
    new ListCommand(new ListAction()).load(program)
    new ListDatabasesCommand(new ListDatabasesAction()).load(program)
    new CreateDatabaseCommand(new CreateDatabaseAction()).load(program)
    new DeleteDatabasesCommand(new DeleteDatabasesAction()).load(program)
    new DeleteAllDatabasesCommand(new DeleteAllDatabasesAction()).load(program)
    new SweepDatabaseCommand(new SweepDatabaseAction()).load(program)

    // Collection
    new ListCollectionsCommand(new ListCollectionsAction()).load(program)
    new CreateCollectionsCommand(new CreateCollectionsAction()).load(program)
    new DeleteCollectionsCommand(new DeleteCollectionsAction()).load(program)
    new DeleteAllCollectionsCommand(new DeleteAllCollectionsAction()).load(
      program
    )

    // Collection
    new ListIndexesCommand(new ListIndexesAction()).load(program)
    new CreateIndexCommand(new CreateIndexAction()).load(program)

    this.handleInvalidCommand(program)
  }

  private static handleInvalidCommand(program: CommanderStatic): void {
    program.on('command:*', () => {
      console.error(
        `\n${ERROR_PREFIX} Invalid command: ${chalk.red('%s')}`,
        program.args.join(' ')
      )
      console.log(
        `See ${chalk.red('--help')} for a list of available commands.\n`
      )
      process.exit(1)
    })
  }
}
