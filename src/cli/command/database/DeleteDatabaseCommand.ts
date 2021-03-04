import { CommanderStatic } from 'commander'
import { AbstractCommand } from '@nestjs/cli/commands/abstract.command'
import { Input } from '@nestjs/cli/commands'

export class DeleteDatabaseCommand extends AbstractCommand {
  // @ts-ignore
  load(program: CommanderStatic): void {
    program
      .command('databases:delete [name]')
      .description('Delete a database')
      .option('-f, --force <forced>', 'Disable confirmation prompt', false)
      .action(async (name, options) => {
        const inputs: Input[] = []
        inputs.push({ name: 'name', value: name })

        const optionsInputs: Input[] = options.force
          ? [{ name: 'force', value: true }]
          : []

        await this.action.handle(inputs, optionsInputs)
      })
  }
}
