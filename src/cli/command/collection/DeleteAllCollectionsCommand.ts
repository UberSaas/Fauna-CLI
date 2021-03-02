import { CommanderStatic } from 'commander'
import { AbstractCommand } from '@nestjs/cli/commands/abstract.command'

export class DeleteAllCollectionsCommand extends AbstractCommand {
  // @ts-ignore
  load(program: CommanderStatic): void {
    program
      .command('collections:delete:all')
      .description('Delete all collections')
      .action(async () => {
        await this.action.handle()
      })
  }
}
