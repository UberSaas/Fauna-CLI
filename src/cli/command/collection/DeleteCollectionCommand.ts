import { CommanderStatic } from 'commander'
import { AbstractCommand } from '@nestjs/cli/commands/abstract.command'
import { Input } from '@nestjs/cli/commands'

export class DeleteCollectionCommand extends AbstractCommand {
  // @ts-ignore
  load(program: CommanderStatic): void {
    program
      .command('collection:delete [name]')
      .description('Delete a collection')
      .action(async (name: string) => {
        const inputs: Input[] = []
        inputs.push({ name: 'name', value: name })
        await this.action.handle(inputs)
      })
  }
}
