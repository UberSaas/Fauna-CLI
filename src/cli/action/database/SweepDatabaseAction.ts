import * as chalk from 'chalk'
import { Input } from '@nestjs/cli/commands'
import { AbstractAction } from '@nestjs/cli/actions'
import * as ora from 'ora'
import { prompt } from 'enquirer'
import { DeleteAllDatabasesAction } from './DeleteAllDatabasesAction'
import { DeleteAllCollectionsAction } from '../collection/DeleteAllCollectionsAction'

export class SweepDatabaseAction extends AbstractAction {
  public async handle(inputs: Input[], options: Input[]): Promise<void> {
    const force = options && options.find((option) => option.name === 'force')
    options = options === undefined ? [] : options

    if (force === undefined || !force.value) {
      const response: any = await prompt({
        type: 'confirm',
        initial: false,
        name: 'confirmed',
        message: `Are you sure you want to delete everything in this database?`,
      })

      if (!response.confirmed) {
        process.exit(0)
      }

      // Make sure called actions will be executed by disabling confirmation prompt.
      options.push({ name: 'force', value: true })
    }

    const spinner = ora().start()

    // Make sure subActions aren't exited
    options.push({ name: 'subAction', value: true })

    await new DeleteAllDatabasesAction().handle(inputs, options)
    await new DeleteAllCollectionsAction().handle(inputs, options)

    spinner.succeed(chalk.green('Action sweep completed'))

    process.exit(0)
  }
}
