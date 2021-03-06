import * as chalk from 'chalk'
import { Input } from '@nestjs/cli/commands'
import { AbstractAction } from '@nestjs/cli/actions'
import * as ora from 'ora'
import { CreateDatabases } from '../../../fauna/application/command/database/CreateDatabases'

export class CreateDatabaseAction extends AbstractAction {
  public async handle(inputs: Input[], options: Input[]): Promise<void> {
    const spinner = ora().start('Create database')

    const names = inputs.find((value: Input) => {
      return value.name === 'names'
    })

    if (names == null || typeof names.value !== 'string') {
      throw new Error('Incorrect name')
    }

    const databaseNames = names.value.split(',')
    const subAction =
      options && options.find((option) => option.name === 'subAction')

    spinner.info(chalk.cyanBright('\nDatabases created:'))

    for (const databaseName of databaseNames) {
      await new CreateDatabases()
        .execute([databaseName])
        .then(() => {
          spinner.info(chalk.yellowBright(`- ${databaseName}`))
        })
        .catch((error: any) => {
          spinner.fail(
            chalk.redBright(`Database '${databaseName}' could not be created`)
          )
          spinner.fail(chalk.redBright(error.message))
        })
    }

    spinner.succeed(chalk.green('Action create:databases completed'))

    if (!subAction) {
      process.exit(0)
    }
  }
}
