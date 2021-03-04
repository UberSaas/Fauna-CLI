import * as chalk from 'chalk'
import { Input } from '@nestjs/cli/commands'
import { AbstractAction } from '@nestjs/cli/actions'
import * as ora from 'ora'
import { prompt } from 'enquirer'
import { DeleteDatabases } from '../../../fauna/application/command/database/DeleteDatabases'

export class DeleteDatabasesAction extends AbstractAction {
  public async handle(inputs: Input[], options: Input[]): Promise<void> {
    const names = inputs.find((value: Input) => {
      return value.name === 'names'
    })

    if (names == null || typeof names.value !== 'string') {
      throw new Error('Incorrect name')
    }

    const force = options && options.find((option) => option.name === 'force')
    const subAction =
      options && options.find((option) => option.name === 'subAction')

    if (force === undefined || !force.value) {
      const response: any = await prompt({
        type: 'confirm',
        initial: false,
        name: 'confirmed',
        message: `Are you sure you want to delete database(s) ${chalk.yellowBright(
          names.value
        )}?`,
      })

      if (!response.confirmed) {
        process.exit(0)
      }
    }

    const spinner = ora().start('Delete database')
    const databaseNames = names.value.split(',')

    spinner.info(chalk.cyanBright('\nDatabases deleted:'))

    for (const databaseName of databaseNames) {
      await new DeleteDatabases()
        .execute([databaseName])
        .then(() => {
          spinner.info(chalk.yellowBright(`- ${databaseName}`))
        })
        .catch((error: any) => {
          spinner.fail(
            chalk.redBright(`Database '${databaseName}' could not be deleted`)
          )
          spinner.fail(chalk.redBright(error.message))
        })
    }

    spinner.succeed(chalk.green('Action delete:databases completed'))

    if (!subAction) {
      process.exit(0)
    }
  }
}
