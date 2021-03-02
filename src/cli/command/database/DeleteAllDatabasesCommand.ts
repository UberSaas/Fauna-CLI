import { CommanderStatic } from 'commander'
import { AbstractCommand } from '@nestjs/cli/commands/abstract.command'

export class DeleteAllDatabasesCommand extends AbstractCommand {
  // @ts-ignore
  load(program: CommanderStatic): void {
    program
      .command('databases:delete:all')
      .description('Delete all databases')
      .action(async () => {
        await this.action.handle()
      })
  }
}
