import * as chalk from 'chalk'
import { CommanderStatic } from 'commander'
import { ERROR_PREFIX } from '@nestjs/cli/lib/ui'
import { CreateDatabaseAction, TestAction } from '../action'
import { CreateDatabaseCommand } from './database/CreateDatabaseCommand'
import { TestCommand } from './TestCommand'
import { DeleteDatabaseCommand } from './database/DeleteDatabaseCommand'
import { DeleteDatabaseAction } from '../action/database/DeleteDatabaseAction'

export class CommandLoader {
  public static load(program: CommanderStatic): void {
    new TestCommand(new TestAction()).load(program)
    new CreateDatabaseCommand(new CreateDatabaseAction()).load(program)
    new DeleteDatabaseCommand(new DeleteDatabaseAction()).load(program)

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
