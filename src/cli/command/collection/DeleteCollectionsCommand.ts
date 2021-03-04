import { CommanderStatic } from 'commander'
import { AbstractCommand } from '@nestjs/cli/commands/abstract.command'
import { Input } from '@nestjs/cli/commands'

export class DeleteCollectionsCommand extends AbstractCommand {
  // @ts-ignore
  load(program: CommanderStatic): void {
    program
      .command('collections:delete [name]')
      .description('Delete one or more collections')
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
