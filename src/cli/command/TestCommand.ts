import { CommanderStatic } from 'commander'
import { AbstractCommand } from '@nestjs/cli/commands/abstract.command'

export class TestCommand extends AbstractCommand {
  // @ts-ignore
  load(program: CommanderStatic): void {
    program
      .command('test')
      .description('Test action')
      .action(async () => {
        await this.action.handle()
      })
  }
}
