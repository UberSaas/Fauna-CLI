import { CommanderStatic } from 'commander'
import { AbstractCommand } from '@nestjs/cli/commands/abstract.command'
import { Input } from '@nestjs/cli/commands'

export class CreateCollectionsCommand extends AbstractCommand {
  // @ts-ignore
  load(program: CommanderStatic): void {
    program
      .command('create:collections [names]')
      .description('Create one or more collections')
      .action(async (names: string) => {
        const inputs: Input[] = []
        inputs.push({ name: 'names', value: names })
        await this.action.handle(inputs)
      })
  }
}
