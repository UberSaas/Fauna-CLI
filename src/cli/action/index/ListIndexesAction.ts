import * as chalk from 'chalk'
import { Input } from '@nestjs/cli/commands'
import { AbstractAction } from '@nestjs/cli/actions'
import * as ora from 'ora'
import { GetIndexNames } from '../../../fauna/application/query/index/GetIndexNames'

export class ListIndexesAction extends AbstractAction {
  public handle(inputs: Input[], options: Input[]): Promise<void> {
    const subAction =
      options && options.find((option) => option.name === 'subAction')
    const spinner = ora().start()

    spinner.info(chalk.cyanBright('\nIndexes:'))

    return new GetIndexNames()
      .execute()
      .then((indexNames) => {
        if (indexNames.length === 0) {
          spinner.info(chalk.yellowBright('No indexes'))
        }

        indexNames.forEach((indexName) => {
          spinner.info(chalk.yellowBright('- ' + indexName))
        })

        spinner.stop()

        if (!subAction) {
          process.exit(0)
        }
      })
      .catch((error: any) => {
        spinner.fail(chalk.redBright(`Indexes could not be listed`))
        spinner.fail(chalk.redBright(error.message))
      })
  }
}
