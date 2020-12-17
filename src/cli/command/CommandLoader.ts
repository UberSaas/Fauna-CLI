import * as chalk from 'chalk'
import { CommanderStatic } from 'commander'
import { ERROR_PREFIX } from '@nestjs/cli/lib/ui'
import { TestAction } from '../action'
import { TestCommand } from './TestCommand'

export class CommandLoader {
  public static load(program: CommanderStatic): void {
    new TestCommand(new TestAction()).load(program)

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
