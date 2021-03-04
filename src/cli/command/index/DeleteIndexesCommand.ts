import { CommanderStatic } from 'commander'
import { AbstractCommand } from '@nestjs/cli/commands/abstract.command'
import { Input } from '@nestjs/cli/commands'

export class DeleteIndexesCommand extends AbstractCommand {
  // @ts-ignore
  load(program: CommanderStatic): void {
    program
      .command('delete:indexes [names]')
      .description('Delete one or more indexes')
      .option('-f, --force <forced>', 'Disable confirmation prompt', false)
      .action(async (names, options) => {
        const inputs: Input[] = []
        inputs.push({ name: 'names', value: names })

        const optionsInputs: Input[] = options.force
          ? [{ name: 'force', value: true }]
          : []

        await this.action.handle(inputs, optionsInputs)
      })
  }
}
