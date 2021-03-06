import { CommanderStatic } from 'commander'
import { AbstractCommand } from '@nestjs/cli/commands/abstract.command'
import { Input } from '@nestjs/cli/commands'

export class CreateModelCommand extends AbstractCommand {
  // @ts-ignore
  load(program: CommanderStatic): void {
    program
      .command(
        'create:model [name] [requiredFilter] [searchFields] [sortFields] [multiSort]'
      )
      .description('Setup collection + search and sort indexes for a model')
      .action(
        async (
          name: string,
          requiredFilter?: string,
          searchFields?: string,
          sortFields?: string,
          multiSort?: string
        ) => {
          const inputs: Input[] = [
            { name: 'name', value: name },
            {
              name: 'multiSort',
              value: multiSort !== undefined && multiSort === 'true',
            },
          ]

          if (requiredFilter !== undefined && requiredFilter !== 'none') {
            inputs.push({
              name: 'requiredFilter',
              value: requiredFilter,
            })
          }

          if (searchFields !== undefined && searchFields !== 'none') {
            inputs.push({
              name: 'searchFields',
              value: searchFields,
            })
          }

          if (sortFields !== undefined && sortFields !== 'none') {
            inputs.push({
              name: 'sortFields',
              value: sortFields,
            })
          }

          await this.action.handle(inputs)
        }
      )
  }
}
