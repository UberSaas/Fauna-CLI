import { CommanderStatic } from 'commander'
import { AbstractCommand } from '@nestjs/cli/commands/abstract.command'
import { Input } from '@nestjs/cli/commands'

export class CreateSchemaCommand extends AbstractCommand {
  // @ts-ignore
  load(program: CommanderStatic): void {
    program
      .command('create:schema [fileName]')
      .description('Setup a database from a configuration file')
      .action(async (fileName: string) => {
        const inputs: Input[] = []
        inputs.push({ name: 'fileName', value: fileName })
        await this.action.handle(inputs)
      })
  }
}
