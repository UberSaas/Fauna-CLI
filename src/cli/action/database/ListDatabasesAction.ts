import * as chalk from 'chalk'
import { Input } from '@nestjs/cli/commands'
import { AbstractAction } from '@nestjs/cli/actions'
import * as ora from 'ora'
import { GetDatabaseNames } from '../../../fauna/application/query/database/GetDatabaseNames'

export class ListDatabasesAction extends AbstractAction {
  public handle(inputs: Input[], options: Input[]): Promise<void> {
    const spinner = ora().start('List databases')

    return new GetDatabaseNames()
      .execute()
      .then((databaseNames) => {
        if (databaseNames.length === 0) {
          spinner.succeed(chalk.green('No databases'))
        }

        databaseNames.forEach((databaseName) => {
          spinner.succeed(chalk.green(databaseName))
        })
      })
      .catch((error: any) => {
        spinner.fail(chalk.redBright(`Databases could not be listed`))
        spinner.fail(chalk.redBright(error.message))
      })
  }
}
