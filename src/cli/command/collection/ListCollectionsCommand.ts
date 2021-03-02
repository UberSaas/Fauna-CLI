import { CommanderStatic } from 'commander'
import { AbstractCommand } from '@nestjs/cli/commands/abstract.command'

export class ListCollectionsCommand extends AbstractCommand {
  // @ts-ignore
  load(program: CommanderStatic): void {
    program
      .command('collections:list')
      .description('List all collections')
      .action(async () => {
        await this.action.handle()
      })
  }
}
