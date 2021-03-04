import { CommanderStatic } from 'commander'
import { AbstractCommand } from '@nestjs/cli/commands/abstract.command'
import { Input } from '@nestjs/cli/commands'

export class DeleteAllDatabasesCommand extends AbstractCommand {
  // @ts-ignore
  load(program: CommanderStatic): void {
    program
      .command('databases:delete:all')
      .description('Delete all databases')
      .option('-f, --force <forced>', 'Disable confirmation prompt', false)
      .action(async (options) => {
        const optionsInputs: Input[] = options.force
          ? [{ name: 'force', value: true }]
          : []

        await this.action.handle([], optionsInputs)
      })
  }
}
