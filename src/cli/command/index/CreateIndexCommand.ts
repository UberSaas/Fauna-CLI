import { CommanderStatic } from 'commander'
import { AbstractCommand } from '@nestjs/cli/commands/abstract.command'
import { Input } from '@nestjs/cli/commands'

export class CreateIndexCommand extends AbstractCommand {
  // @ts-ignore
  load(program: CommanderStatic): void {
    program
      .command(
        'create:index [name] [collectionName] [unique] [terms] [values] [reverse]'
      )
      .description('Create an index')
      .action(
        async (
          name: string,
          collectionName: string,
          unique?: string,
          terms?: string,
          values?: string,
          reverse?: string
        ) => {
          const inputs: Input[] = [
            { name: 'name', value: name },
            { name: 'collectionName', value: collectionName },
            {
              name: 'unique',
              value: unique !== undefined && unique === 'true',
            },
            {
              name: 'terms',
              value: terms !== undefined && terms !== 'none' ? terms : false,
            },
            {
              name: 'values',
              value: values !== undefined && values !== 'none' ? values : false,
            },
            {
              name: 'reverse',
              value:
                reverse !== undefined && reverse !== 'none' ? reverse : false,
            },
          ]

          await this.action.handle(inputs)
        }
      )
  }
}
