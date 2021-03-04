import * as chalk from 'chalk'
import { Input } from '@nestjs/cli/commands'
import { AbstractAction } from '@nestjs/cli/actions'
import * as ora from 'ora'
import { GetDatabaseNames } from '../../../fauna/application/query/database/GetDatabaseNames'
import { DeleteDatabases } from '../../../fauna/application/command/database/DeleteDatabases'
import { prompt } from 'enquirer'

export class DeleteAllDatabasesAction extends AbstractAction {
  public async handle(inputs: Input[], options: Input[]): Promise<void> {
    const force = options && options.find((option) => option.name === 'force')

    if (force === undefined || !force.value) {
      const response: any = await prompt({
        type: 'confirm',
        initial: false,
        name: 'confirmed',
        message: `Are you sure you want to delete all databases?`,
      })

      if (!response.confirmed) {
        process.exit(0)
      }
    }

    const spinner = ora().start('Delete all databases')

    await new GetDatabaseNames()
      .execute()
      .then(async (databaseNames) => {
        if (databaseNames.length === 0) {
          spinner.succeed(chalk.green('No databases'))
        }

        const deleteDatabases = new DeleteDatabases()
        for (const databaseName of databaseNames) {
          await deleteDatabases
            .execute([databaseName])
            .then(() => {
              spinner.succeed(chalk.green(`Database '${databaseName}' deleted`))
            })
            .catch((error: any) => {
              spinner.fail(
                chalk.redBright(
                  `Database '${databaseName}' could not be deleted`
                )
              )
              spinner.fail(chalk.redBright(error.message))
            })
        }

        spinner.succeed(chalk.green('Action databases:delete:all completed'))
      })
      .catch((error: any) => {
        spinner.fail(chalk.redBright(`Databases could not be deleted`))
        spinner.fail(chalk.redBright(error.message))
      })
  }
}
