import { CommanderStatic } from 'commander'
import { AbstractCommand } from '@nestjs/cli/commands/abstract.command'

export class ListDatabasesCommand extends AbstractCommand {
  // @ts-ignore
  load(program: CommanderStatic): void {
    program
      .command('list:databases')
      .description('List all databases')
      .action(async () => {
        await this.action.handle()
      })
  }
}
