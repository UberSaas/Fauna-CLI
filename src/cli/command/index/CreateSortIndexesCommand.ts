import { CommanderStatic } from 'commander'
import { AbstractCommand } from '@nestjs/cli/commands/abstract.command'
import { Input } from '@nestjs/cli/commands'

export class CreateSortIndexesCommand extends AbstractCommand {
  // @ts-ignore
  load(program: CommanderStatic): void {
    program
      .command('create:indexes:sort [collectionName] [sortFields] [multiSort]')
      .description('Create sort indexes for a collection')
      .action(
        async (
          collectionName: string,
          sortFields: string,
          multiSort?: boolean
        ) => {
          const inputs: Input[] = [
            { name: 'collectionName', value: collectionName },
            {
              name: 'sortFields',
              value: sortFields,
            },
          ]

          if (multiSort !== undefined) {
            inputs.push({
              name: 'multiSort',
              value: multiSort,
            })
          }

          await this.action.handle(inputs)
        }
      )
  }
}
