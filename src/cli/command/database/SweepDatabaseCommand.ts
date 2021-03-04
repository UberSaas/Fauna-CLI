import { CommanderStatic } from 'commander'
import { AbstractCommand } from '@nestjs/cli/commands/abstract.command'
import { Input } from '@nestjs/cli/commands'

export class SweepDatabaseCommand extends AbstractCommand {
  // @ts-ignore
  load(program: CommanderStatic): void {
    program
      .command('sweep')
      .description(
        'Sweep database. Deletes everything inside the database: child databases, collections, indexes, functions, roles.'
      )
      .option('-f, --force <forced>', 'Disable confirmation prompt', false)
      .action(async (options) => {
        const optionsInputs: Input[] = options.force
          ? [{ name: 'force', value: true }]
          : []

        await this.action.handle([], optionsInputs)
      })
  }
}
