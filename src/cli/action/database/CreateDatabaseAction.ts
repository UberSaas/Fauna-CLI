import * as chalk from 'chalk'
import { Input } from '@nestjs/cli/commands'
import { AbstractAction } from '@nestjs/cli/actions'
import * as ora from 'ora'
import { CreateDatabases } from '../../../fauna/application/command/database/CreateDatabases'

export class CreateDatabaseAction extends AbstractAction {
  public async handle(inputs: Input[], options: Input[]): Promise<void> {
    const spinner = ora().start('Create database')

    const name = inputs.find((value: Input) => {
      return value.name === 'name'
    })

    if (name == null || typeof name.value !== 'string') {
      throw new Error('Incorrect name')
    }

    const databaseNames = name.value.split(',')

    for (const databaseName of databaseNames) {
      await new CreateDatabases()
        .execute([databaseName])
        .then(() => {
          spinner.succeed(chalk.green(`Database '${databaseName}' created`))
        })
        .catch((error: any) => {
          spinner.fail(
            chalk.redBright(`Database '${databaseName}' could not be created`)
          )
          spinner.fail(chalk.redBright(error.message))
        })
    }

    spinner.succeed(chalk.green('Action databases:create completed'))
  }
}
