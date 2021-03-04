import { CommanderStatic } from 'commander'
import { AbstractCommand } from '@nestjs/cli/commands/abstract.command'

export class ListIndexesCommand extends AbstractCommand {
  // @ts-ignore
  load(program: CommanderStatic): void {
    program
      .command('list:indexes')
      .description('List all indexes')
      .action(async () => {
        await this.action.handle()
      })
  }
}
