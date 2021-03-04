import * as chalk from 'chalk'
import { Input } from '@nestjs/cli/commands'
import { AbstractAction } from '@nestjs/cli/actions'
import * as ora from 'ora'
import { GetCollectionNames } from '../../../fauna/application/query/collection/GetCollectionNames'

export class ListCollectionsAction extends AbstractAction {
  public handle(inputs: Input[], options: Input[]): Promise<void> {
    const subAction =
      options && options.find((option) => option.name === 'subAction')
    const spinner = ora().start()

    spinner.info(chalk.cyanBright('\nCollections:'))

    return new GetCollectionNames()
      .execute()
      .then((collectionNames) => {
        if (collectionNames.length === 0) {
          spinner.info(chalk.yellowBright('No collections'))
        }

        collectionNames.forEach((collectionName) => {
          spinner.info(chalk.yellowBright('- ' + collectionName))
        })

        spinner.stop()

        if (!subAction) {
          process.exit(0)
        }
      })
      .catch((error: any) => {
        spinner.fail(chalk.redBright(`Collections could not be listed`))
        spinner.fail(chalk.redBright(error.message))
      })
  }
}
