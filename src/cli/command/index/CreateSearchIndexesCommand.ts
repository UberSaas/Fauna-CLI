import { CommanderStatic } from 'commander'
import { AbstractCommand } from '@nestjs/cli/commands/abstract.command'
import { Input } from '@nestjs/cli/commands'

export class CreateSearchIndexesCommand extends AbstractCommand {
  // @ts-ignore
  load(program: CommanderStatic): void {
    program
      .command(
        'create:indexes:search [collectionName] [searchFields] [requiredFilter]'
      )
      .description('Create search indexes for a collection')
      .action(
        async (
          collectionName: string,
          searchFields: string,
          requiredFilter?: string
        ) => {
          const inputs: Input[] = [
            { name: 'collectionName', value: collectionName },
            {
              name: 'searchFields',
              value: searchFields,
            },
          ]

          if (requiredFilter !== undefined) {
            inputs.push({
              name: 'requiredFilter',
              value: requiredFilter,
            })
          }

          await this.action.handle(inputs)
        }
      )
  }
}
