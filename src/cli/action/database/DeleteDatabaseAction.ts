import * as chalk from 'chalk'
import { Input } from '@nestjs/cli/commands'
import { AbstractAction } from '@nestjs/cli/actions'
import * as ora from 'ora'
import { prompt } from 'enquirer'
import { DeleteDatabases } from '../../../fauna/application/command/database/DeleteDatabases'

export class DeleteDatabaseAction extends AbstractAction {
  public async handle(inputs: Input[], options: Input[]): Promise<void> {
    const name = inputs.find((value: Input) => {
      return value.name === 'name'
    })

    if (name == null || typeof name.value !== 'string') {
      throw new Error('Incorrect name')
    }

    const response: any = await prompt({
      type: 'confirm',
      initial: false,
      name: 'confirmed',
      message: `Sure you want to delete database(s) ${chalk.yellowBright(
        name.value
      )}?`,
    })

    if (!response.confirmed) {
      process.exit(0)
    }

    const spinner = ora().start('Delete database')
    const databaseNames = name.value.split(',')

    for (const databaseName of databaseNames) {
      await new DeleteDatabases()
        .execute([databaseName])
        .then(() => {
          spinner.succeed(chalk.green(`Database '${databaseName}' deleted`))
        })
        .catch((error: any) => {
          spinner.fail(
            chalk.redBright(`Database '${databaseName}' could not be deleted`)
          )
          spinner.fail(chalk.redBright(error.message))
        })
    }

    spinner.succeed(chalk.green('Action databases:delete completed'))
  }
}
