import * as chalk from 'chalk'
import { Input } from '@nestjs/cli/commands'
import { AbstractAction } from '@nestjs/cli/actions'
import * as ora from 'ora'
import { GetDatabaseNames } from '../../../fauna/application/query/database/GetDatabaseNames'

export class ListDatabasesAction extends AbstractAction {
  public handle(inputs: Input[], options: Input[]): Promise<void> {
    const subAction =
      options && options.find((option) => option.name === 'subAction')
    const spinner = ora().start()

    spinner.info(chalk.cyanBright('\nDatabases:'))

    return new GetDatabaseNames()
      .execute()
      .then((databaseNames) => {
        if (databaseNames.length === 0) {
          spinner.info(chalk.yellowBright('No databases'))
        }

        databaseNames.forEach((databaseName) => {
          spinner.info(chalk.yellowBright('- ' + databaseName))
        })

        spinner.stop()

        if (!subAction) {
          process.exit(0)
        }
      })
      .catch((error: any) => {
        spinner.fail(chalk.redBright(`Databases could not be listed`))
        spinner.fail(chalk.redBright(error.message))
      })
  }
}
